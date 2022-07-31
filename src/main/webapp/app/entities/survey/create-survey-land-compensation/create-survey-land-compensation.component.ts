import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISurvey } from '../survey.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { SurveyService } from '../service/survey.service';
import { SurveyDeleteDialogComponent } from '../delete/survey-delete-dialog.component';
import { LoaderService } from 'app/loader.service';
import { LandCompensationCreateComponent } from '../modal-create-land-compensation/land-compensation-create.component';

@Component({
  selector: 'jhi-create-survey-land-compensation',
  templateUrl: './create-survey-land-compensation.component.html',
})
export class CreateSurveyLandCompensationComponent implements OnInit {
  surveys?: ISurvey[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected surveyService: SurveyService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    private loaderService: LoaderService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.loaderService.show(true);
    this.surveyService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        'status.equals': 'OPEN',
      })
      .subscribe({
        next: (res: HttpResponse<ISurvey[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          this.loaderService.show(false);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
          this.loaderService.show(false);
        },
      });
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(_index: number, item: ISurvey): number {
    return item.id!;
  }

  delete(survey: ISurvey): void {
    const modalRef = this.modalService.open(SurveyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.survey = survey;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  createCompensation(survey: ISurvey): void{
    const modalRef = this.modalService.open(LandCompensationCreateComponent, { size: 'xl', backdropClass: 'light-blue-backdrop' }); 
    modalRef.componentInstance.survey = survey;
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

  protected onSuccess(data: ISurvey[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/survey'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.surveys = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
