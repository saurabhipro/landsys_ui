import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentFileHeader } from '../payment-file-header.model';

@Component({
  selector: 'jhi-payment-file-header-detail',
  templateUrl: './payment-file-header-detail.component.html',
})
export class PaymentFileHeaderDetailComponent implements OnInit {
  paymentFileHeader: IPaymentFileHeader | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentFileHeader }) => {
      this.paymentFileHeader = paymentFileHeader;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
