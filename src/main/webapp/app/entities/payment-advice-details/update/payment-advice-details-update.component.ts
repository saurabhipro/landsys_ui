import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaymentAdviceDetails, PaymentAdviceDetails } from '../payment-advice-details.model';
import { PaymentAdviceDetailsService } from '../service/payment-advice-details.service';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { PaymentAdviceService } from 'app/entities/payment-advice/service/payment-advice.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { KhatedarService } from 'app/entities/khatedar/service/khatedar.service';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

@Component({
  selector: 'jhi-payment-advice-details-update',
  templateUrl: './payment-advice-details-update.component.html',
})
export class PaymentAdviceDetailsUpdateComponent implements OnInit {
  isSaving = false;
  hissaTypeValues = Object.keys(HissaType);

  paymentAdvicesSharedCollection: IPaymentAdvice[] = [];
  projectLandsSharedCollection: IProjectLand[] = [];
  khatedarsSharedCollection: IKhatedar[] = [];

  editForm = this.fb.group({
    id: [],
    landOwners: [null, [Validators.required]],
    hissaType: [null, [Validators.required]],
    paymentAdvice: [null, Validators.required],
    projectLand: [null, Validators.required],
    khatedar: [null, Validators.required],
  });

  constructor(
    protected paymentAdviceDetailsService: PaymentAdviceDetailsService,
    protected paymentAdviceService: PaymentAdviceService,
    protected projectLandService: ProjectLandService,
    protected khatedarService: KhatedarService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentAdviceDetails }) => {
      this.updateForm(paymentAdviceDetails);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentAdviceDetails = this.createFromForm();
    if (paymentAdviceDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentAdviceDetailsService.update(paymentAdviceDetails));
    } else {
      this.subscribeToSaveResponse(this.paymentAdviceDetailsService.create(paymentAdviceDetails));
    }
  }

  trackPaymentAdviceById(_index: number, item: IPaymentAdvice): number {
    return item.id!;
  }

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  trackKhatedarById(_index: number, item: IKhatedar): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentAdviceDetails>>): void {
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

  protected updateForm(paymentAdviceDetails: IPaymentAdviceDetails): void {
    this.editForm.patchValue({
      id: paymentAdviceDetails.id,
      landOwners: paymentAdviceDetails.landOwners,
      hissaType: paymentAdviceDetails.hissaType,
      paymentAdvice: paymentAdviceDetails.paymentAdvice,
      projectLand: paymentAdviceDetails.projectLand,
      khatedar: paymentAdviceDetails.khatedar,
    });

    this.paymentAdvicesSharedCollection = this.paymentAdviceService.addPaymentAdviceToCollectionIfMissing(
      this.paymentAdvicesSharedCollection,
      paymentAdviceDetails.paymentAdvice
    );
    this.projectLandsSharedCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsSharedCollection,
      paymentAdviceDetails.projectLand
    );
    this.khatedarsSharedCollection = this.khatedarService.addKhatedarToCollectionIfMissing(
      this.khatedarsSharedCollection,
      paymentAdviceDetails.khatedar
    );
  }

  protected loadRelationshipsOptions(): void {
    this.paymentAdviceService
      .query()
      .pipe(map((res: HttpResponse<IPaymentAdvice[]>) => res.body ?? []))
      .pipe(
        map((paymentAdvices: IPaymentAdvice[]) =>
          this.paymentAdviceService.addPaymentAdviceToCollectionIfMissing(paymentAdvices, this.editForm.get('paymentAdvice')!.value)
        )
      )
      .subscribe((paymentAdvices: IPaymentAdvice[]) => (this.paymentAdvicesSharedCollection = paymentAdvices));

    this.projectLandService
      .query()
      .pipe(map((res: HttpResponse<IProjectLand[]>) => res.body ?? []))
      .pipe(
        map((projectLands: IProjectLand[]) =>
          this.projectLandService.addProjectLandToCollectionIfMissing(projectLands, this.editForm.get('projectLand')!.value)
        )
      )
      .subscribe((projectLands: IProjectLand[]) => (this.projectLandsSharedCollection = projectLands));

    this.khatedarService
      .query()
      .pipe(map((res: HttpResponse<IKhatedar[]>) => res.body ?? []))
      .pipe(
        map((khatedars: IKhatedar[]) =>
          this.khatedarService.addKhatedarToCollectionIfMissing(khatedars, this.editForm.get('khatedar')!.value)
        )
      )
      .subscribe((khatedars: IKhatedar[]) => (this.khatedarsSharedCollection = khatedars));
  }

  protected createFromForm(): IPaymentAdviceDetails {
    return {
      ...new PaymentAdviceDetails(),
      id: this.editForm.get(['id'])!.value,
      landOwners: this.editForm.get(['landOwners'])!.value,
      hissaType: this.editForm.get(['hissaType'])!.value,
      paymentAdvice: this.editForm.get(['paymentAdvice'])!.value,
      projectLand: this.editForm.get(['projectLand'])!.value,
      khatedar: this.editForm.get(['khatedar'])!.value,
    };
  }
}
