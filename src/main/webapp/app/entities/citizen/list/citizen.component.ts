import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICitizen } from '../citizen.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { CitizenService } from '../service/citizen.service';
import { CitizenDeleteDialogComponent } from '../delete/citizen-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { faUnderline } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-citizen',
  templateUrl: './citizen.component.html',
})
export class CitizenComponent implements OnInit {
  citizens?: ICitizen[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  filterString!: string;
  filterBy = 'Name';
  searchString!: string;

  constructor(
    protected citizenService: CitizenService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.citizenService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ICitizen[]>) => {
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

  searchFor(searchString: string): void {
    console.log('Searching for Khatedar...');
    //  this.handleNavigation();
    //  this.originaKhatedars= this.khatedars;
    // console.log(this.originaKhatedars);

    function checkForSearchString(citizen: ICitizen): ICitizen | undefined {
      console.log('SEARCHING ...');
      /*
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
    else {
      this.handleNavigation();
    }
    */
      return undefined;
    }
  }

  filter(): void {
    // this.khatedarService.filter(this.filterBy, this.filterString, this.contextProject).subscribe(data => {
    /*
      console.log("FILTERING DATA....:");
    this.khatedarService.filter().subscribe(data => {
      this.khatedars = data;
     
    }); */
  }

  trackId(_index: number, item: ICitizen): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(citizen: ICitizen): void {
    const modalRef = this.modalService.open(CitizenDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.citizen = citizen;
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

  protected onSuccess(data: ICitizen[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/citizen'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.citizens = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
