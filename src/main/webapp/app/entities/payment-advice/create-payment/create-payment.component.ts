import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest } from 'rxjs';

import { IPaymentAdvice, ICreatePaymentFileAdvices } from '../payment-advice.model';
import { PaymentAdviceService } from '../service/payment-advice.service';
import { PaymentAdviceDeleteDialogComponent } from '../delete/payment-advice-delete-dialog.component';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'jhi-create-payment',
  templateUrl: './create-payment.component.html',
})
export class CreatePaymentComponent implements OnInit {
  paymentAdvices?: IPaymentAdvice[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  selectedIds: number[] = [];
  searchAccountHolderName = '';  // New field to store the search value

  constructor(
    protected paymentAdviceService: PaymentAdviceService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    private loaderService: LoaderService
  ) {}

  OnClick(id: number | undefined): void {
    if (id !== undefined) {
      const index = this.selectedIds.indexOf(id);
      if (index === -1) {
        this.selectedIds.push(id);
      } else {
        this.selectedIds.splice(index, 1);
      }
    }
  }

  isSelected(id: number | undefined): boolean {
    return id !== undefined && this.selectedIds.includes(id);
  }

  isAllChecked(): boolean {
    if (!this.paymentAdvices || this.paymentAdvices.length === 0) {
      return false;
    }
    return this.paymentAdvices.every(paymentAdvice => paymentAdvice.id !== undefined && this.selectedIds.includes(paymentAdvice.id));
  }

  toggleAll(event: any): void {
    if (!this.paymentAdvices) {
      return;
    }

    if (event.target.checked) {
      this.paymentAdvices.forEach(paymentAdvice => {
        if (paymentAdvice.id !== undefined && !this.selectedIds.includes(paymentAdvice.id)) {
          this.selectedIds.push(paymentAdvice.id);
        }
      });
    } else {
      this.selectedIds = [];
    }
  }

  createPaymentFile(): void {
    if (this.selectedIds.length && this.paymentAdvices?.length) {
      const advices: ICreatePaymentFileAdvices[] = [];
      this.selectedIds.forEach(id => {
        const foundRecord = this.paymentAdvices?.find(pay => pay.id === id);
        if (foundRecord?.id && foundRecord.bankName && foundRecord.ifscCode) {
          advices.push({ paymentAdviceId: foundRecord.id, bankName: foundRecord.bankName, ifscCode: foundRecord.ifscCode });
        }
      });
      this.loaderService.show(true);
      this.paymentAdviceService
        .createPaymentAFile({
          paymentAdvices: advices,
        })
        .subscribe({
          next: () => {
            this.loadPage();
            this.loaderService.show(false);
          },
          error: () => {
            this.onError();
            this.loaderService.show(false);
          },
        });
    }
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.paymentAdviceService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        'paymentStatus.equals': 'PENDING',
        'accountHolderName.contains': this.searchAccountHolderName // Add this line for search filtering
      })
      .subscribe({
        next: (res: HttpResponse<IPaymentAdvice[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  searchByAccountHolderName(): void {
    this.page = 1;  // Reset to the first page when searching
    this.loadPage();
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(_index: number, item: IPaymentAdvice): number {
    return item.id!;
  }

  delete(paymentAdvice: IPaymentAdvice): void {
    const modalRef = this.modalService.open(PaymentAdviceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.paymentAdvice = paymentAdvice;
    modalRef.closed.subscribe((reason: string) => {
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
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]: any) => {
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

  protected onSuccess(data: IPaymentAdvice[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/payment-advice/create-payment-file'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.paymentAdvices = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
