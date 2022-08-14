import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { ASC, DESC } from 'app/config/pagination.constants';
import { DataUtils } from 'app/core/util/data-util.service';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { CitizenService } from 'app/entities/citizen/service/citizen.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'jhi-modal-citizen-list',
  templateUrl: './modal-citizen-list.component.html',
})
export class ModalCitizenListComponent implements OnInit {
  multipleKhaterdars = false;
  citizens?: ICitizen[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = 10;
  page = 1;
  predicate = "id";
  ascending!: boolean;
  ngbPaginationPage = 1;
  selectedCitizen: ICitizen[] = [];
  searchString = "";

  constructor(
    protected citizenService: CitizenService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    public activeModal: NgbActiveModal,
    private loaderService: LoaderService
  ) {}

  OnClick(event:any, citizen: ICitizen ): void {
    
    if (citizen.id) {
      const index = this.selectedCitizen.findIndex( sc=> sc.id === citizen.id);
      if (index === -1) {
        if(this.selectedCitizen.length === 0 || this.multipleKhaterdars ){
          this.selectedCitizen.push(citizen);
        } else {
          event.target.checked = false;
        }
      } else {
        this.selectedCitizen.splice(index, 1);
      }
    } else {
      event.target.checked = false;
    }
  }

  searchFor(): void {

        this.loadPage(1, this.searchString.trim());
  }

  loadPage(page?: number, searchString?: string): void {
    this.loaderService.show(true);
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page;
   
    this.citizenService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        'aadhar.contains': searchString ? searchString : "",
      })
      .subscribe({
        next: (res: HttpResponse<ICitizen[]>) => {
          this.loaderService.show(false);
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        error: () => {
          this.loaderService.show(false);
          this.isLoading = false;
          this.onError();
        },
      });
  }

  ngOnInit(): void {
    this.loadPage(this.page);
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

  addCitizen() : void{
    this.activeModal.close({
      citizens: this.selectedCitizen
    })
  }

  close() : void{
    this.activeModal.dismiss();
  }




  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }



  protected onSuccess(data: ICitizen[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.citizens = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }

  
}
