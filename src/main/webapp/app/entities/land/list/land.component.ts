import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILand } from '../land.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { LandService } from '../service/land.service';
import { LandDeleteDialogComponent } from '../delete/land-delete-dialog.component';

@Component({
  selector: 'jhi-land',
  templateUrl: './land.component.html',
})
export class LandComponent implements OnInit {
  lands?: ILand[];
  origlands: ILand[] | undefined;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  searchString!: string;

  constructor(
    protected landService: LandService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.landService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ILand[]>) => {
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
    this.lands = this.origlands;

    function checkForSearchString(lands: ILand): ILand | undefined {
      console.log('SEARCHING ...');
      console.log(lands);

      if (
        lands.id!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        lands.district!.state!.name!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        lands.district!.name!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        lands.village!.name!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        lands.khasraNumber!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        lands.khatauni!.toString().toLowerCase().includes(searchString.toLowerCase()) ||
        lands.area!.toString().toLowerCase().includes(searchString.toLowerCase())
      ) {
        return lands;
      }
      return undefined;
    }

    if (searchString !== '') {
      this.lands = this.lands?.filter(checkForSearchString);
      console.log(this.lands?.length);
      if (this.lands?.length === 0) {
        // this.handleSearch('khasra', searchString);
      }
    } else {
      this.handleNavigation();
    }
  }

  trackId(_index: number, item: ILand): number {
    return item.id!;
  }

  delete(land: ILand): void {
    const modalRef = this.modalService.open(LandDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.land = land;
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

  protected onSuccess(data: ILand[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/land'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.lands = data ?? [];
    this.origlands = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
