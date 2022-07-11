import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPaymentFileRecon } from '../payment-file-recon.model';

@Component({
  selector: 'jhi-payment-file-recon-detail',
  templateUrl: './payment-file-recon-detail.component.html',
})
export class PaymentFileReconDetailComponent implements OnInit {
  paymentFileRecon: IPaymentFileRecon | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentFileRecon }) => {
      this.paymentFileRecon = paymentFileRecon;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
