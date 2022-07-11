import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentFile } from '../payment-file.model';

@Component({
  selector: 'jhi-payment-file-detail',
  templateUrl: './payment-file-detail.component.html',
})
export class PaymentFileDetailComponent implements OnInit {
  paymentFile: IPaymentFile | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentFile }) => {
      this.paymentFile = paymentFile;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
