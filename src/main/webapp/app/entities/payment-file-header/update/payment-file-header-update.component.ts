import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaymentFileHeader, PaymentFileHeader } from '../payment-file-header.model';
import { PaymentFileHeaderService } from '../service/payment-file-header.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
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

  projectsSharedCollection: IProject[] = [];

  editForm = this.fb.group({
    id: [],
    grandTotalPaymentAmount: [null, [Validators.required]],
    paymentStatus: [null, [Validators.required]],
    paymentMode: [],
    approverRemarks: [],
    project: [null, Validators.required],
  });

  constructor(
    protected paymentFileHeaderService: PaymentFileHeaderService,
    protected projectService: ProjectService,
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

  trackProjectById(_index: number, item: IProject): number {
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
      project: paymentFileHeader.project,
    });

    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing(
      this.projectsSharedCollection,
      paymentFileHeader.project
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(
        map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing(projects, this.editForm.get('project')!.value))
      )
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));
  }

  protected createFromForm(): IPaymentFileHeader {
    return {
      ...new PaymentFileHeader(),
      id: this.editForm.get(['id'])!.value,
      grandTotalPaymentAmount: this.editForm.get(['grandTotalPaymentAmount'])!.value,
      paymentStatus: this.editForm.get(['paymentStatus'])!.value,
      paymentMode: this.editForm.get(['paymentMode'])!.value,
      approverRemarks: this.editForm.get(['approverRemarks'])!.value,
      project: this.editForm.get(['project'])!.value,
    };
  }
}
