import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaymentFileRecon, PaymentFileRecon } from '../payment-file-recon.model';
import { PaymentFileReconService } from '../service/payment-file-recon.service';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { PaymentAdviceService } from 'app/entities/payment-advice/service/payment-advice.service';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';

@Component({
  selector: 'jhi-payment-file-recon-update',
  templateUrl: './payment-file-recon-update.component.html',
})
export class PaymentFileReconUpdateComponent implements OnInit {
  isSaving = false;
  paymentStatusValues = Object.keys(PaymentStatus);

  paymentAdvicesCollection: IPaymentAdvice[] = [];

  editForm = this.fb.group({
    id: [],
    primaryHolderName: [null, [Validators.required]],
    paymentAmount: [null, [Validators.required]],
    paymentDate: [],
    utrNumber: [null, [Validators.required]],
    referenceNumber: [null, []],
    paymentStatus: [null, [Validators.required]],
    paymentAdvice: [],
  });

  constructor(
    protected paymentFileReconService: PaymentFileReconService,
    protected paymentAdviceService: PaymentAdviceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentFileRecon }) => {
      this.updateForm(paymentFileRecon);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentFileRecon = this.createFromForm();
    if (paymentFileRecon.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentFileReconService.update(paymentFileRecon));
    } else {
      this.subscribeToSaveResponse(this.paymentFileReconService.create(paymentFileRecon));
    }
  }

  trackPaymentAdviceById(_index: number, item: IPaymentAdvice): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentFileRecon>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(paymentFileRecon: IPaymentFileRecon): void {
    this.editForm.patchValue({
      id: paymentFileRecon.id,
      primaryHolderName: paymentFileRecon.primaryHolderName,
      paymentAmount: paymentFileRecon.paymentAmount,
      paymentDate: paymentFileRecon.paymentDate,
      utrNumber: paymentFileRecon.utrNumber,
      referenceNumber: paymentFileRecon.referenceNumber,
      paymentStatus: paymentFileRecon.paymentStatus,
      paymentAdvice: paymentFileRecon.paymentAdvice,
    });

    this.paymentAdvicesCollection = this.paymentAdviceService.addPaymentAdviceToCollectionIfMissing(
      this.paymentAdvicesCollection,
      paymentFileRecon.paymentAdvice
    );
  }

  protected loadRelationshipsOptions(): void {
    this.paymentAdviceService
      .query({ 'paymentFileReconId.specified': 'false' })
      .pipe(map((res: HttpResponse<IPaymentAdvice[]>) => res.body ?? []))
      .pipe(
        map((paymentAdvices: IPaymentAdvice[]) =>
          this.paymentAdviceService.addPaymentAdviceToCollectionIfMissing(paymentAdvices, this.editForm.get('paymentAdvice')!.value)
        )
      )
      .subscribe((paymentAdvices: IPaymentAdvice[]) => (this.paymentAdvicesCollection = paymentAdvices));
  }

  protected createFromForm(): IPaymentFileRecon {
    return {
      ...new PaymentFileRecon(),
      id: this.editForm.get(['id'])!.value,
      primaryHolderName: this.editForm.get(['primaryHolderName'])!.value,
      paymentAmount: this.editForm.get(['paymentAmount'])!.value,
      paymentDate: this.editForm.get(['paymentDate'])!.value,
      utrNumber: this.editForm.get(['utrNumber'])!.value,
      referenceNumber: this.editForm.get(['referenceNumber'])!.value,
      paymentStatus: this.editForm.get(['paymentStatus'])!.value,
      paymentAdvice: this.editForm.get(['paymentAdvice'])!.value,
    };
  }
}
