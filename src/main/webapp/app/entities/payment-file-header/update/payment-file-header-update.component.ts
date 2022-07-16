import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaymentFileHeader, PaymentFileHeader } from '../payment-file-header.model';
import { PaymentFileHeaderService } from '../service/payment-file-header.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';

@Component({
  selector: 'jhi-payment-file-header-update',
  templateUrl: './payment-file-header-update.component.html',
})
export class PaymentFileHeaderUpdateComponent implements OnInit {
  isSaving = false;
  paymentStatusValues = Object.keys(PaymentStatus);
  paymentAdviceTypeValues = Object.keys(PaymentAdviceType);

  projectLandsSharedCollection: IProjectLand[] = [];

  editForm = this.fb.group({
    id: [],
    grandTotalPaymentAmount: [null, [Validators.required]],
    paymentStatus: [null, [Validators.required]],
    paymentMode: [],
    approverRemarks: [],
    projectLand: [null, Validators.required],
  });

  constructor(
    protected paymentFileHeaderService: PaymentFileHeaderService,
    protected projectLandService: ProjectLandService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentFileHeader }) => {
      this.updateForm(paymentFileHeader);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paymentFileHeader = this.createFromForm();
    if (paymentFileHeader.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentFileHeaderService.update(paymentFileHeader));
    } else {
      this.subscribeToSaveResponse(this.paymentFileHeaderService.create(paymentFileHeader));
    }
  }

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaymentFileHeader>>): void {
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

  protected updateForm(paymentFileHeader: IPaymentFileHeader): void {
    this.editForm.patchValue({
      id: paymentFileHeader.id,
      grandTotalPaymentAmount: paymentFileHeader.grandTotalPaymentAmount,
      paymentStatus: paymentFileHeader.paymentStatus,
      paymentMode: paymentFileHeader.paymentMode,
      approverRemarks: paymentFileHeader.approverRemarks,
      projectLand: paymentFileHeader.projectLand,
    });

    this.projectLandsSharedCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsSharedCollection,
      paymentFileHeader.projectLand
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
  }

  protected createFromForm(): IPaymentFileHeader {
    return {
      ...new PaymentFileHeader(),
      id: this.editForm.get(['id'])!.value,
      grandTotalPaymentAmount: this.editForm.get(['grandTotalPaymentAmount'])!.value,
      paymentStatus: this.editForm.get(['paymentStatus'])!.value,
      paymentMode: this.editForm.get(['paymentMode'])!.value,
      approverRemarks: this.editForm.get(['approverRemarks'])!.value,
      projectLand: this.editForm.get(['projectLand'])!.value,
    };
  }
}
