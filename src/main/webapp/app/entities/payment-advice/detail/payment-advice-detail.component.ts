import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentAdvice } from '../payment-advice.model';

@Component({
  selector: 'jhi-payment-advice-detail',
  templateUrl: './payment-advice-detail.component.html',
})
export class PaymentAdviceDetailComponent implements OnInit {
  paymentAdvice: IPaymentAdvice | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentAdvice }) => {
      this.paymentAdvice = paymentAdvice;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
