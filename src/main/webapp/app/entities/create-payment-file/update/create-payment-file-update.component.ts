import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICreatePaymentFile, CreatePaymentFile } from '../create-payment-file.model';
import { CreatePaymentFileService } from '../service/create-payment-file.service';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

@Component({
  selector: 'jhi-create-payment-file-update',
  templateUrl: './create-payment-file-update.component.html',
})
export class CreatePaymentFileUpdateComponent implements OnInit {
  isSaving = false;
  paymentAdviceTypeValues = Object.keys(PaymentAdviceType);
  paymentStatusValues = Object.keys(PaymentStatus);
  hissaTypeValues = Object.keys(HissaType);

  editForm = this.fb.group({
    id: [],
    accountHolderName: [null, [Validators.required]],
    accountHolderBankName: [null, [Validators.required]],
    paymentAmount: [null, [Validators.required]],
    bankName: [null, [Validators.required]],
    accountNumber: [null, [Validators.required]],
    ifscCode: [null, [Validators.required]],
    checkNumber: [],
    micrCode: [],
    paymentAdviceType: [],
    referenceNumber: [],
    paymentStatus: [null, [Validators.required]],
    hissaType: [null, [Validators.required]],
  });

  constructor(
    protected createPaymentFileService: CreatePaymentFileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ createPaymentFile }) => {
      this.updateForm(createPaymentFile);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const createPaymentFile = this.createFromForm();
    if (createPaymentFile.id !== undefined) {
      this.subscribeToSaveResponse(this.createPaymentFileService.update(createPaymentFile));
    } else {
      this.subscribeToSaveResponse(this.createPaymentFileService.create(createPaymentFile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICreatePaymentFile>>): void {
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

  protected updateForm(createPaymentFile: ICreatePaymentFile): void {
    this.editForm.patchValue({
      id: createPaymentFile.id,
      accountHolderName: createPaymentFile.accountHolderName,
      accountHolderBankName: createPaymentFile.accountHolderBankName,
      paymentAmount: createPaymentFile.paymentAmount,
      bankName: createPaymentFile.bankName,
      accountNumber: createPaymentFile.accountNumber,
      ifscCode: createPaymentFile.ifscCode,
      checkNumber: createPaymentFile.checkNumber,
      micrCode: createPaymentFile.micrCode,
      paymentAdviceType: createPaymentFile.paymentAdviceType,
      referenceNumber: createPaymentFile.referenceNumber,
      paymentStatus: createPaymentFile.paymentStatus,
      hissaType: createPaymentFile.hissaType,
    });
  }

  protected createFromForm(): ICreatePaymentFile {
    return {
      ...new CreatePaymentFile(),
      id: this.editForm.get(['id'])!.value,
      accountHolderName: this.editForm.get(['accountHolderName'])!.value,
      accountHolderBankName: this.editForm.get(['accountHolderBankName'])!.value,
      paymentAmount: this.editForm.get(['paymentAmount'])!.value,
      bankName: this.editForm.get(['bankName'])!.value,
      accountNumber: this.editForm.get(['accountNumber'])!.value,
      ifscCode: this.editForm.get(['ifscCode'])!.value,
      checkNumber: this.editForm.get(['checkNumber'])!.value,
      micrCode: this.editForm.get(['micrCode'])!.value,
      paymentAdviceType: this.editForm.get(['paymentAdviceType'])!.value,
      referenceNumber: this.editForm.get(['referenceNumber'])!.value,
      paymentStatus: this.editForm.get(['paymentStatus'])!.value,
      hissaType: this.editForm.get(['hissaType'])!.value,
    };
  }
}
