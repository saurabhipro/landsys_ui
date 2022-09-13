import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPaymentFileRecon } from '../payment-file-recon.model';

import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { PaymentFileReconService } from '../service/payment-file-recon.service';
import { PaymentFileReconDeleteDialogComponent } from '../delete/payment-file-recon-delete-dialog.component';

@Component({
  selector: 'jhi-payment-file-recon',
  templateUrl: './payment-file-recon.component.html',
})
export class PaymentFileReconComponent implements OnInit {
  @ViewChild('fileUpload')
  fileUpload!: ElementRef;
  paymentFileRecons?: IPaymentFileRecon[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  fileBeingUploaded = false;
  progress = 10;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  uploadRecon = this.fb.group({
    Reconfile: [],
  });

  constructor(
    protected paymentFileReconService: PaymentFileReconService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected fb: FormBuilder
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.paymentFileReconService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IPaymentFileRecon[]>) => {
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

  trackId(_index: number, item: IPaymentFileRecon): number {
    return item.id!;
  }

  clickFileUpload(): void {
    console.log('CLICK FILE UPLOAD');
  }

  // uploadFile(event: Event):void {
  //   console.log('Upload File');
  //   const target = event.target as HTMLInputElement;
  //     if (target.files && target.files.length > 0) {
  //         console.log(target.files[0].name);
  //     }
  //   }
  // uploadFile(event: Event, field: string, isImage: boolean): void {
  //   this.dataUtils.loadFileToForm(event, this.uploadRecon, field, isImage).subscribe({
  //     error: (err: FileLoadError) =>
  //       this.eventManager.broadcast(new EventWithContent<AlertError>('jhipsterApp.error', { ...err, key: 'error.file.' + err.key })),
  //   });
  // }

  uploadFile(): void {
    this.fileBeingUploaded = true;
    this.progress = 0;
    this.paymentFileReconService.upload(this.fileUpload.nativeElement.files[0]).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total!);
        } else if (event instanceof HttpResponse) {
          this.fileBeingUploaded = false;
          if (event.headers.get('excelfile')) {
            const errorFile = new Blob([event.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const fileURL = window.URL.createObjectURL(errorFile);
            // const link = document.createElement('a');
            // link.href = fileURL;
            // link.download = 'records_with_error';
            // link.click();
            this.fileUpload.nativeElement.files[0].clean;
            this.loadPage();
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

  delete(paymentFileRecon: IPaymentFileRecon): void {
    const modalRef = this.modalService.open(PaymentFileReconDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.paymentFileRecon = paymentFileRecon;
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

  protected onSuccess(data: IPaymentFileRecon[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/payment-file-recon'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.paymentFileRecons = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
