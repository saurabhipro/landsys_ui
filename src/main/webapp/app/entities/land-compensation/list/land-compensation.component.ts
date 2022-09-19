import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILandCompensation } from '../land-compensation.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { LandCompensationService } from '../service/land-compensation.service';
import { CreateSurveyLandCompensationComponent } from '../../survey/create-survey-land-compensation/create-survey-land-compensation.component';
import { LandCompensationDeleteDialogComponent } from '../delete/land-compensation-delete-dialog.component';
import { LandCompensationCreateComponent } from '../../survey/modal-create-land-compensation/land-compensation-create.component';

@Component({
  selector: 'jhi-land-compensation',
  templateUrl: './land-compensation.component.html',
})
export class LandCompensationComponent implements OnInit {
  landCompensations?: ILandCompensation[];
  origlandCompensations?: ILandCompensation[] | undefined;

  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  searchString!: string;

  constructor(
    protected landCompensationService: LandCompensationService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.landCompensationService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ILandCompensation[]>) => {
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
    this.landCompensations = this.origlandCompensations;

    function checkForSearchString(landCompensations: ILandCompensation): ILandCompensation | undefined {
      console.log('SEARCHING ...');
      console.log(landCompensations);

      if (
        landCompensations.id!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        landCompensations.projectLand!.land!.khasraNumber!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        landCompensations.survey!.id!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        landCompensations.hissaType!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        landCompensations.area!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        landCompensations.landMarketValue!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        landCompensations.paymentAmount!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        landCompensations.compensationStatus!.toString().toLowerCase().includes(searchString.toLowerCase())
      ) {
        return landCompensations;
      }
      return undefined;
    }

    if (searchString !== '') {
      this.landCompensations = this.landCompensations?.filter(checkForSearchString);
      console.log(this.landCompensations?.length);
      if (this.landCompensations?.length === 0) {
        // this.handleSearch('khasra', searchString);
      }
    } else {
      this.handleNavigation();
    }
  }

  trackId(_index: number, item: ILandCompensation): number {
    return item.id!;
  }

  delete(landCompensation: ILandCompensation): void {
    const modalRef = this.modalService.open(LandCompensationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.landCompensation = landCompensation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  createCompensation(landCompensation: ILandCompensation): void {
    const modalRef = this.modalService.open(LandCompensationCreateComponent, { size: 'xl', backdropClass: 'light-blue-backdrop' });
    modalRef.componentInstance.survey = landCompensation;
    // this.loadPage();
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

  // protected handleSearch(filterString?: string, filterBy?: string): void {
  //   combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
  //     const page = params.get('page');
  //     const pageNumber = +(page ?? 1);
  //     const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
  //     const predicate = sort[0];
  //     const ascending = sort[1] === ASC;
  //     this.predicate = predicate;
  //     this.ascending = ascending;
  //     this.searchFilter(pageNumber, true, filterBy, filterString);
  //   });
  // }

  protected onSuccess(data: ILandCompensation[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/land-compensation'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.landCompensations = data ?? [];
    this.origlandCompensations = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  // searchFilter(page?: number, dontNavigate?: boolean, filterString?: string, filterBy?: string): void {
  //   this.isLoading = true;
  //   const pageToLoad: number = page ?? this.page ?? 1;

  //   let reqObj: any;
  //   if (filterBy === 'aadhar') {
  //     reqObj = {
  //       page: pageToLoad - 1,
  //       size: this.itemsPerPage,
  //       sort: this.sort(),
  //       'aadhar.contains': filterString,
  //     };
  //   }

  //   this.LandCompensationService.query(reqObj).subscribe({
  //     next: (res: HttpResponse<ILandCompensation[]>) => {
  //       this.isLoading = false;
  //       this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //       this.onError();
  //     },
  //   });
  // }
}
