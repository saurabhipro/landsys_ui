import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICreatePaymentFile } from '../create-payment-file.model';

@Component({
  selector: 'jhi-create-payment-file-detail',
  templateUrl: './create-payment-file-detail.component.html',
})
export class CreatePaymentFileDetailComponent implements OnInit {
  createPaymentFile: ICreatePaymentFile | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ createPaymentFile }) => {
      this.createPaymentFile = createPaymentFile;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
