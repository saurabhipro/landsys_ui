import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPaymentFile, PaymentFile } from '../payment-file.model';
import { PaymentFileService } from '../service/payment-file.service';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';

@Component({
  selector: 'jhi-payment-file-update',
  templateUrl: './payment-file-update.component.html',
})
export class PaymentFileUpdateComponent implements OnInit {
  isSaving = false;
  paymentStatusValues = Object.keys(PaymentStatus);

  editForm = this.fb.group({
    id: [],
    paymentFileId: [null, [Validators.required]],
    totalPaymentAmount: [null, [Validators.required]],
    paymentFileDate: [],
    paymentStatus: [null, [Validators.required]],
    bankName: [],
    ifscCode: [],
  });

  constructor(protected paymentFileService: PaymentFileService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentFile }) => {
      this.updateForm(paymentFile);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentFile = this.createFromForm();
    if (paymentFile.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentFileService.update(paymentFile));
    } else {
      this.subscribeToSaveResponse(this.paymentFileService.create(paymentFile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentFile>>): void {
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

  protected updateForm(paymentFile: IPaymentFile): void {
    this.editForm.patchValue({
      id: paymentFile.id,
      paymentFileId: paymentFile.paymentFileId,
      totalPaymentAmount: paymentFile.totalPaymentAmount,
      paymentFileDate: paymentFile.paymentFileDate,
      paymentStatus: paymentFile.paymentStatus,
      bankName: paymentFile.bankName,
      ifscCode: paymentFile.ifscCode,
    });
  }

  protected createFromForm(): IPaymentFile {
    return {
      ...new PaymentFile(),
      id: this.editForm.get(['id'])!.value,
      paymentFileId: this.editForm.get(['paymentFileId'])!.value,
      totalPaymentAmount: this.editForm.get(['totalPaymentAmount'])!.value,
      paymentFileDate: this.editForm.get(['paymentFileDate'])!.value,
      paymentStatus: this.editForm.get(['paymentStatus'])!.value,
      bankName: this.editForm.get(['bankName'])!.value,
      ifscCode: this.editForm.get(['ifscCode'])!.value,
    };
  }
}
