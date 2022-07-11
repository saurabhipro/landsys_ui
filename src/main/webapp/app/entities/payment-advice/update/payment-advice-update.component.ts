import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaymentAdvice, PaymentAdvice } from '../payment-advice.model';
import { PaymentAdviceService } from '../service/payment-advice.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { LandCompensationService } from 'app/entities/land-compensation/service/land-compensation.service';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

@Component({
  selector: 'jhi-payment-advice-update',
  templateUrl: './payment-advice-update.component.html',
})
export class PaymentAdviceUpdateComponent implements OnInit {
  isSaving = false;
  paymentAdviceTypeValues = Object.keys(PaymentAdviceType);
  paymentStatusValues = Object.keys(PaymentStatus);
  hissaTypeValues = Object.keys(HissaType);

  projectLandsSharedCollection: IProjectLand[] = [];
  landCompensationsSharedCollection: ILandCompensation[] = [];

  editForm = this.fb.group({
    id: [],
    accountHolderName: [null, [Validators.required]],
    paymentAmount: [null, [Validators.required]],
    bankName: [null, [Validators.required]],
    accountNumber: [null, [Validators.required]],
    ifscCode: [null, [Validators.required]],
    checkNumber: [],
    micrCode: [],
    paymentAdviceType: [],
    referenceNumber: [null, []],
    paymentStatus: [null, [Validators.required]],
    hissaType: [null, [Validators.required]],
    projectLand: [null, Validators.required],
    landCompensation: [null, Validators.required],
  });

  constructor(
    protected paymentAdviceService: PaymentAdviceService,
    protected projectLandService: ProjectLandService,
    protected landCompensationService: LandCompensationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentAdvice }) => {
      this.updateForm(paymentAdvice);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentAdvice = this.createFromForm();
    if (paymentAdvice.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentAdviceService.update(paymentAdvice));
    } else {
      this.subscribeToSaveResponse(this.paymentAdviceService.create(paymentAdvice));
    }
  }

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  trackLandCompensationById(_index: number, item: ILandCompensation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentAdvice>>): void {
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

  protected updateForm(paymentAdvice: IPaymentAdvice): void {
    this.editForm.patchValue({
      id: paymentAdvice.id,
      accountHolderName: paymentAdvice.accountHolderName,
      paymentAmount: paymentAdvice.paymentAmount,
      bankName: paymentAdvice.bankName,
      accountNumber: paymentAdvice.accountNumber,
      ifscCode: paymentAdvice.ifscCode,
      checkNumber: paymentAdvice.checkNumber,
      micrCode: paymentAdvice.micrCode,
      paymentAdviceType: paymentAdvice.paymentAdviceType,
      referenceNumber: paymentAdvice.referenceNumber,
      paymentStatus: paymentAdvice.paymentStatus,
      hissaType: paymentAdvice.hissaType,
      projectLand: paymentAdvice.projectLand,
      landCompensation: paymentAdvice.landCompensation,
    });

    this.projectLandsSharedCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsSharedCollection,
      paymentAdvice.projectLand
    );
    this.landCompensationsSharedCollection = this.landCompensationService.addLandCompensationToCollectionIfMissing(
      this.landCompensationsSharedCollection,
      paymentAdvice.landCompensation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectLandService
      .query()
      .pipe(map((res: HttpResponse<IProjectLand[]>) => res.body ?? []))
      .pipe(
        map((projectLands: IProjectLand[]) =>
          this.projectLandService.addProjectLandToCollectionIfMissing(projectLands, this.editForm.get('projectLand')!.value)
        )
      )
      .subscribe((projectLands: IProjectLand[]) => (this.projectLandsSharedCollection = projectLands));

    this.landCompensationService
      .query()
      .pipe(map((res: HttpResponse<ILandCompensation[]>) => res.body ?? []))
      .pipe(
        map((landCompensations: ILandCompensation[]) =>
          this.landCompensationService.addLandCompensationToCollectionIfMissing(
            landCompensations,
            this.editForm.get('landCompensation')!.value
          )
        )
      )
      .subscribe((landCompensations: ILandCompensation[]) => (this.landCompensationsSharedCollection = landCompensations));
  }

  protected createFromForm(): IPaymentAdvice {
    return {
      ...new PaymentAdvice(),
      id: this.editForm.get(['id'])!.value,
      accountHolderName: this.editForm.get(['accountHolderName'])!.value,
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
      projectLand: this.editForm.get(['projectLand'])!.value,
      landCompensation: this.editForm.get(['landCompensation'])!.value,
    };
  }
}
