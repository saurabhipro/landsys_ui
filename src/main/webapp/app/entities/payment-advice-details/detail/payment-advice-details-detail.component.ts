import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentAdviceDetails } from '../payment-advice-details.model';

@Component({
  selector: 'jhi-payment-advice-details-detail',
  templateUrl: './payment-advice-details-detail.component.html',
})
export class PaymentAdviceDetailsDetailComponent implements OnInit {
  paymentAdviceDetails: IPaymentAdviceDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentAdviceDetails }) => {
      this.paymentAdviceDetails = paymentAdviceDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
