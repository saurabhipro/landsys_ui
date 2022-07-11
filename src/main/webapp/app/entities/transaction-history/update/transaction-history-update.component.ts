import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITransactionHistory, TransactionHistory } from '../transaction-history.model';
import { TransactionHistoryService } from '../service/transaction-history.service';
import { EventStatus } from 'app/entities/enumerations/event-status.model';

@Component({
  selector: 'jhi-transaction-history-update',
  templateUrl: './transaction-history-update.component.html',
})
export class TransactionHistoryUpdateComponent implements OnInit {
  isSaving = false;
  eventStatusValues = Object.keys(EventStatus);

  editForm = this.fb.group({
    id: [],
    projectName: [null, [Validators.required]],
    khasraNumber: [null, [Validators.required]],
    state: [null, [Validators.required]],
    citizenName: [null, [Validators.required]],
    citizenAadhar: [null, [Validators.required]],
    surveyerName: [],
    landValue: [null, [Validators.required]],
    paymentAmount: [],
    accountNumber: [],
    bankName: [],
    transactionId: [],
    transactionType: [],
    eventType: [],
    eventStatus: [],
    approver1: [],
    approver2: [],
    approver3: [],
  });

  constructor(
    protected transactionHistoryService: TransactionHistoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transactionHistory }) => {
      this.updateForm(transactionHistory);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transactionHistory = this.createFromForm();
    if (transactionHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.transactionHistoryService.update(transactionHistory));
    } else {
      this.subscribeToSaveResponse(this.transactionHistoryService.create(transactionHistory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransactionHistory>>): void {
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

  protected updateForm(transactionHistory: ITransactionHistory): void {
    this.editForm.patchValue({
      id: transactionHistory.id,
      projectName: transactionHistory.projectName,
      khasraNumber: transactionHistory.khasraNumber,
      state: transactionHistory.state,
      citizenName: transactionHistory.citizenName,
      citizenAadhar: transactionHistory.citizenAadhar,
      surveyerName: transactionHistory.surveyerName,
      landValue: transactionHistory.landValue,
      paymentAmount: transactionHistory.paymentAmount,
      accountNumber: transactionHistory.accountNumber,
      bankName: transactionHistory.bankName,
      transactionId: transactionHistory.transactionId,
      transactionType: transactionHistory.transactionType,
      eventType: transactionHistory.eventType,
      eventStatus: transactionHistory.eventStatus,
      approver1: transactionHistory.approver1,
      approver2: transactionHistory.approver2,
      approver3: transactionHistory.approver3,
    });
  }

  protected createFromForm(): ITransactionHistory {
    return {
      ...new TransactionHistory(),
      id: this.editForm.get(['id'])!.value,
      projectName: this.editForm.get(['projectName'])!.value,
      khasraNumber: this.editForm.get(['khasraNumber'])!.value,
      state: this.editForm.get(['state'])!.value,
      citizenName: this.editForm.get(['citizenName'])!.value,
      citizenAadhar: this.editForm.get(['citizenAadhar'])!.value,
      surveyerName: this.editForm.get(['surveyerName'])!.value,
      landValue: this.editForm.get(['landValue'])!.value,
      paymentAmount: this.editForm.get(['paymentAmount'])!.value,
      accountNumber: this.editForm.get(['accountNumber'])!.value,
      bankName: this.editForm.get(['bankName'])!.value,
      transactionId: this.editForm.get(['transactionId'])!.value,
      transactionType: this.editForm.get(['transactionType'])!.value,
      eventType: this.editForm.get(['eventType'])!.value,
      eventStatus: this.editForm.get(['eventStatus'])!.value,
      approver1: this.editForm.get(['approver1'])!.value,
      approver2: this.editForm.get(['approver2'])!.value,
      approver3: this.editForm.get(['approver3'])!.value,
    };
  }
}
