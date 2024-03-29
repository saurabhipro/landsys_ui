import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPaymentFileHeader } from '../payment-file-header.model';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { PaymentFileHeaderService } from '../service/payment-file-header.service';
import { PaymentFileHeaderDeleteDialogComponent } from '../delete/payment-file-header-delete-dialog.component';

@Component({
  selector: 'jhi-payment-file-header',
  templateUrl: './payment-file-header.component.html',
})
export class PaymentFileHeaderComponent implements OnInit {
  paymentFileHeaders?: IPaymentFileHeader[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  selectedIds: number[] = [];
  private http: any;
  private resourceUrl: any;

  constructor(
    protected paymentFileHeaderService: PaymentFileHeaderService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.paymentFileHeaderService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IPaymentFileHeader[]>) => {
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

  trackId(_index: number, item: IPaymentFileHeader): number {
    return item.id!;
  }

  delete(paymentFileHeader: IPaymentFileHeader): void {
    const modalRef = this.modalService.open(PaymentFileHeaderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.paymentFileHeader = paymentFileHeader;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  OnClick(id: any): void {
    if (id) {
      const index = this.selectedIds.indexOf(id);
      if (index === -1) {
        this.selectedIds.push(id);
      } else {
        this.selectedIds.splice(index, 1);
      }
    }
  }

  downloadPaymentFile(paymentFileHeader: IPaymentFileHeader): void {
    if (paymentFileHeader.id != null) {
      this.paymentFileHeaderService.downloadPaymentFileService(paymentFileHeader.id).subscribe(data => {
        const fileURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `PaymentFile_${paymentFileHeader.paymentFileId ? paymentFileHeader.paymentFileId : 'file'}`;
        link.click();
      });
    }
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

  protected onSuccess(data: IPaymentFileHeader[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/payment-file-header'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.paymentFileHeaders = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
