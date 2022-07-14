import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IKhatedar, Khatedar } from '../khatedar.model';
import { KhatedarService } from '../service/khatedar.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { CitizenService } from 'app/entities/citizen/service/citizen.service';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { PaymentAdviceService } from 'app/entities/payment-advice/service/payment-advice.service';

@Component({
  selector: 'jhi-khatedar-update',
  templateUrl: './khatedar-update.component.html',
})
export class KhatedarUpdateComponent implements OnInit {
  isSaving = false;

  projectLandsSharedCollection: IProjectLand[] = [];
  citizensSharedCollection: ICitizen[] = [];
  paymentAdvicesSharedCollection: IPaymentAdvice[] = [];

  editForm = this.fb.group({
    id: [],
    caseFileNo: [null, [Validators.required]],
    remarks: [null, [Validators.required]],
    khatedarStatus: [],
    projectLand: [null, Validators.required],
    citizen: [null, Validators.required],
    paymentAdvice: [],
  });

  constructor(
    protected khatedarService: KhatedarService,
    protected projectLandService: ProjectLandService,
    protected citizenService: CitizenService,
    protected paymentAdviceService: PaymentAdviceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ khatedar }) => {
      this.updateForm(khatedar);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const khatedar = this.createFromForm();
    if (khatedar.id !== undefined) {
      this.subscribeToSaveResponse(this.khatedarService.update(khatedar));
    } else {
      this.subscribeToSaveResponse(this.khatedarService.create(khatedar));
    }
  }

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  trackCitizenById(_index: number, item: ICitizen): number {
    return item.id!;
  }

  trackPaymentAdviceById(_index: number, item: IPaymentAdvice): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKhatedar>>): void {
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

  protected updateForm(khatedar: IKhatedar): void {
    this.editForm.patchValue({
      id: khatedar.id,
      caseFileNo: khatedar.caseFileNo,
      remarks: khatedar.remarks,
      khatedarStatus: khatedar.khatedarStatus,
      projectLand: khatedar.projectLand,
      citizen: khatedar.citizen,
      paymentAdvice: khatedar.paymentAdvice,
    });

    this.projectLandsSharedCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsSharedCollection,
      khatedar.projectLand
    );
    this.citizensSharedCollection = this.citizenService.addCitizenToCollectionIfMissing(this.citizensSharedCollection, khatedar.citizen);
    this.paymentAdvicesSharedCollection = this.paymentAdviceService.addPaymentAdviceToCollectionIfMissing(
      this.paymentAdvicesSharedCollection,
      khatedar.paymentAdvice
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

    this.citizenService
      .query()
      .pipe(map((res: HttpResponse<ICitizen[]>) => res.body ?? []))
      .pipe(
        map((citizens: ICitizen[]) => this.citizenService.addCitizenToCollectionIfMissing(citizens, this.editForm.get('citizen')!.value))
      )
      .subscribe((citizens: ICitizen[]) => (this.citizensSharedCollection = citizens));

    this.paymentAdviceService
      .query()
      .pipe(map((res: HttpResponse<IPaymentAdvice[]>) => res.body ?? []))
      .pipe(
        map((paymentAdvices: IPaymentAdvice[]) =>
          this.paymentAdviceService.addPaymentAdviceToCollectionIfMissing(paymentAdvices, this.editForm.get('paymentAdvice')!.value)
        )
      )
      .subscribe((paymentAdvices: IPaymentAdvice[]) => (this.paymentAdvicesSharedCollection = paymentAdvices));
  }

  protected createFromForm(): IKhatedar {
    return {
      ...new Khatedar(),
      id: this.editForm.get(['id'])!.value,
      caseFileNo: this.editForm.get(['caseFileNo'])!.value,
      remarks: this.editForm.get(['remarks'])!.value,
      khatedarStatus: this.editForm.get(['khatedarStatus'])!.value,
      projectLand: this.editForm.get(['projectLand'])!.value,
      citizen: this.editForm.get(['citizen'])!.value,
      paymentAdvice: this.editForm.get(['paymentAdvice'])!.value,
    };
  }
}
