import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICreatePaymentFile, ICreatePaymentFileAdvices, IPaymentAdvice } from '../payment-advice.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { PaymentAdviceService } from '../service/payment-advice.service';
import { PaymentAdviceDeleteDialogComponent } from '../delete/payment-advice-delete-dialog.component';
import { LoaderService } from 'app/loader.service';

@Component({
  selector: 'jhi-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.css']
})
export class CreatePaymentComponent implements OnInit {
  paymentAdvices?: IPaymentAdvice[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate = 'id';
  ascending = true;
  ngbPaginationPage = 1;

  selectedIds: number[] = [];

  constructor(
    protected paymentAdviceService: PaymentAdviceService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.handleNavigation();
  }

  onClick(id: number): void {
    if (id) {
      const index = this.selectedIds.indexOf(id);
      if (index === -1) {
        this.selectedIds.push(id);
      } else {
        this.selectedIds.splice(index, 1);
      }
    }
  }

  filterCards(): void {
    const value = (document.getElementById('searchInput') as HTMLInputElement).value.toLowerCase();
    const cardHeaders = document.querySelectorAll('.card-header');
  
    cardHeaders.forEach((header) => {
      const parentCard = header.parentElement;
      if (parentCard) {
        const headerElement = header as HTMLElement;
        if (headerElement.innerText.toLowerCase().includes(value)) {
          parentCard.style.display = '';
        } else {
          parentCard.style.display = 'none';
        }
      }
    });
  }
  

  toggleCollapse(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.classList.toggle('show');
    }
  }

  toggleAll(): void {
    console.log("helllo")
    const collapses = document.querySelectorAll('.collapse');
    const allShown = Array.from(collapses).every((collapse) =>
      collapse.classList.contains('show')
    );

    collapses.forEach((collapse) => {
      collapse.classList.toggle('show', !allShown);
    });
  }

  createPaymentFile(): void {
    const checkboxes = document.querySelectorAll('.citizen-checkbox:checked');
    const selectedCitizens = Array.from(checkboxes).map((checkbox) =>
      (checkbox as HTMLInputElement).getAttribute('data-name')
    );

    if (selectedCitizens.length > 0) {
      const confirmPayment = confirm(
        'Do you want to create a payment file for: ' +
          selectedCitizens.join(', ') +
          '?'
      );
      if (confirmPayment) {
        alert(
          'Payment file created for: ' +
            selectedCitizens.join(', ') +
            '. The Payment File ID is PAY/2024/001'
        );
      }
    } else {
      alert('No citizens selected.');
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

  trackId(_index: number, item: IPaymentAdvice): number {
    return item.id!;
  }

  delete(paymentAdvice: IPaymentAdvice): void {
    const modalRef = this.modalService.open(PaymentAdviceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.paymentAdvice = paymentAdvice;
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
      this.router.navigate(['/payment-advice'], {
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
