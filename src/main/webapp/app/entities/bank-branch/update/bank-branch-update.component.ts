import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBankBranch, BankBranch } from '../bank-branch.model';
import { BankBranchService } from '../service/bank-branch.service';
import { IBank } from 'app/entities/bank/bank.model';
import { BankService } from 'app/entities/bank/service/bank.service';

@Component({
  selector: 'jhi-bank-branch-update',
  templateUrl: './bank-branch-update.component.html',
})
export class BankBranchUpdateComponent implements OnInit {
  isSaving = false;

  banksSharedCollection: IBank[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    ifsc: [null, [Validators.required]],
    address: [null, [Validators.required]],
    bank: [null, Validators.required],
  });

  constructor(
    protected bankBranchService: BankBranchService,
    protected bankService: BankService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankBranch }) => {
      this.updateForm(bankBranch);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bankBranch = this.createFromForm();
    if (bankBranch.id !== undefined) {
      this.subscribeToSaveResponse(this.bankBranchService.update(bankBranch));
    } else {
      this.subscribeToSaveResponse(this.bankBranchService.create(bankBranch));
    }
  }

  trackBankById(_index: number, item: IBank): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBankBranch>>): void {
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

  protected updateForm(bankBranch: IBankBranch): void {
    this.editForm.patchValue({
      id: bankBranch.id,
      name: bankBranch.name,
      ifsc: bankBranch.ifsc,
      address: bankBranch.address,
      bank: bankBranch.bank,
    });

    this.banksSharedCollection = this.bankService.addBankToCollectionIfMissing(this.banksSharedCollection, bankBranch.bank);
  }

  protected loadRelationshipsOptions(): void {
    this.bankService
      .query()
      .pipe(map((res: HttpResponse<IBank[]>) => res.body ?? []))
      .pipe(map((banks: IBank[]) => this.bankService.addBankToCollectionIfMissing(banks, this.editForm.get('bank')!.value)))
      .subscribe((banks: IBank[]) => (this.banksSharedCollection = banks));
  }

  protected createFromForm(): IBankBranch {
    return {
      ...new BankBranch(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      ifsc: this.editForm.get(['ifsc'])!.value,
      address: this.editForm.get(['address'])!.value,
      bank: this.editForm.get(['bank'])!.value,
    };
  }
}
