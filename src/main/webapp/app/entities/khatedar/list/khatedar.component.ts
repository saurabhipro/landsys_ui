import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IKhatedar } from '../khatedar.model';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { KhatedarService } from '../service/khatedar.service';
import { KhatedarDeleteDialogComponent } from '../delete/khatedar-delete-dialog.component';
import { Project } from 'app/entities/project/project.model';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventWithContent } from 'app/core/util/event-manager.service';
import { Alert } from 'app/core/util/alert.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { Citizen } from 'app/entities/citizen/citizen.model';
import { ProjectLand } from 'app/entities/project-land/project-land.model';

@Component({
  selector: 'jhi-khatedar',
  templateUrl: './khatedar.component.html',
})
export class KhatedarComponent implements OnInit {
  @ViewChild('fileUpload')
  fileUpload!: ElementRef;
  khatedars?: IKhatedar[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  filterBy = 'Name';
  searchString!: string;
  fileBeingUploaded = false;
  filterString!: string;
  contextProject!: Project;
  progress = 10;
  eventManager: any;
  originaKhatedars: IKhatedar[] | undefined;

  constructor(
    protected khatedarService: KhatedarService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected dataUtils: DataUtils
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.khatedarService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IKhatedar[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(_index: number, item: IKhatedar): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  clickFileUpload(): void {
    this.fileUpload.nativeElement.click();
  }

  uploadFile(): void {
    this.fileBeingUploaded = true;
    this.progress = 0;
    this.khatedarService.upload(this.fileUpload.nativeElement.files[0]).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total!);
        } else if (event instanceof HttpResponse) {
          this.fileBeingUploaded = false;
          this.eventManager.broadcast(
            new EventWithContent<Alert>('landsysUiApp.success', {
              type: 'success',
              message: 'File uploaded successfully.',
              translationKey: 'en',
            })
          );
          if (event.headers.get('excelfile')) {
            const errorFile = new Blob([event.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const fileURL = window.URL.createObjectURL(errorFile);
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = 'records_with_error';
            link.click();
          }
        }
      },
      (error: FileLoadError): void => {
        this.fileBeingUploaded = false;
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('landsysUiApp.error', {
            ...error,
            key: 'error.file.' + error.key,
          })
        );
      },
      () => {
        this.loadPage();
      }
    );
  }

  downloadTemplate(): void {
    this.khatedarService.downloadTemplate().subscribe(data => {
      const fileURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'template';
      link.click();
    });
  }

  searchFor(searchString: string): void {
    this.khatedars = this.originaKhatedars;

    function checkForSearchString(khatedar: IKhatedar): IKhatedar | undefined {
      if (khatedar.citizen && ((khatedar.citizen as Citizen).name as string).toLowerCase().includes(searchString.toLowerCase())) {
        return khatedar;
      }
      if (khatedar.id!.toString().toLowerCase().includes(searchString.toLowerCase())) {
        return khatedar;
      }
      if ((khatedar.caseFileNo as string).toLowerCase().includes(searchString.toLowerCase())) {
        return khatedar;
      }
      if (khatedar.citizen && ((khatedar.citizen as Citizen).aadhar as string).toLowerCase().includes(searchString.toLowerCase())) {
        return khatedar;
      }
      if (khatedar.citizen && ((khatedar.citizen as Citizen).pan as string).toLowerCase().includes(searchString.toLowerCase())) {
        return khatedar;
      }
      if (
        khatedar.projectLand &&
        ((khatedar.projectLand as ProjectLand).land?.khasraNumber as string).toLowerCase().includes(searchString.toLowerCase())
      ) {
        return khatedar;
      }
      return undefined;
    }

    if (searchString !== '') {
      this.khatedars = this.khatedars?.filter(checkForSearchString);
    }
  }

  filter(): void {
    // this.khatedarService.filter(this.filterBy, this.filterString, this.contextProject).subscribe(data => {
    this.khatedarService.filter().subscribe(data => {
      this.khatedars = data;
    });
  }

  delete(khatedar: IKhatedar): void {
    const modalRef = this.modalService.open(KhatedarDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.khatedar = khatedar;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IKhatedar[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/khatedar'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.khatedars = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
