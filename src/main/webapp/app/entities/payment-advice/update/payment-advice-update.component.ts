import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaymentAdvice, PaymentAdvice } from '../payment-advice.model';
import { PaymentAdviceService } from '../service/payment-advice.service';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { LandCompensationService } from 'app/entities/land-compensation/service/land-compensation.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { CitizenService } from 'app/entities/citizen/service/citizen.service';
import { IPaymentFile } from 'app/entities/payment-file/payment-file.model';
import { PaymentFileService } from 'app/entities/payment-file/service/payment-file.service';
import { ILand } from 'app/entities/land/land.model';
import { LandService } from 'app/entities/land/service/land.service';
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

  landCompensationsSharedCollection: ILandCompensation[] = [];
  projectLandsSharedCollection: IProjectLand[] = [];
  surveysSharedCollection: ISurvey[] = [];
  citizensSharedCollection: ICitizen[] = [];
  paymentFilesSharedCollection: IPaymentFile[] = [];
  landsSharedCollection: ILand[] = [];

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
    referenceNumber: [null, []],
    paymentStatus: [null, [Validators.required]],
    hissaType: [null, [Validators.required]],
    landCompensation: [null, Validators.required],
    projectLand: [null, Validators.required],
    survey: [null, Validators.required],
    citizen: [null, Validators.required],
    paymentFile: [],
    land: [],
  });

  constructor(
    protected paymentAdviceService: PaymentAdviceService,
    protected landCompensationService: LandCompensationService,
    protected projectLandService: ProjectLandService,
    protected surveyService: SurveyService,
    protected citizenService: CitizenService,
    protected paymentFileService: PaymentFileService,
    protected landService: LandService,
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

  trackLandCompensationById(_index: number, item: ILandCompensation): number {
    return item.id!;
  }

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  trackSurveyById(_index: number, item: ISurvey): number {
    return item.id!;
  }

  trackCitizenById(_index: number, item: ICitizen): number {
    return item.id!;
  }

  trackPaymentFileById(_index: number, item: IPaymentFile): number {
    return item.id!;
  }

  trackLandById(_index: number, item: ILand): number {
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
      accountHolderBankName: paymentAdvice.accountHolderBankName,
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
      landCompensation: paymentAdvice.landCompensation,
      projectLand: paymentAdvice.projectLand,
      survey: paymentAdvice.survey,
      citizen: paymentAdvice.citizen,
      paymentFile: paymentAdvice.paymentFile,
      land: paymentAdvice.land,
    });

    this.landCompensationsSharedCollection = this.landCompensationService.addLandCompensationToCollectionIfMissing(
      this.landCompensationsSharedCollection,
      paymentAdvice.landCompensation
    );
    this.projectLandsSharedCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsSharedCollection,
      paymentAdvice.projectLand
    );
    this.surveysSharedCollection = this.surveyService.addSurveyToCollectionIfMissing(this.surveysSharedCollection, paymentAdvice.survey);
    this.citizensSharedCollection = this.citizenService.addCitizenToCollectionIfMissing(
      this.citizensSharedCollection,
      paymentAdvice.citizen
    );
    this.paymentFilesSharedCollection = this.paymentFileService.addPaymentFileToCollectionIfMissing(
      this.paymentFilesSharedCollection,
      paymentAdvice.paymentFile
    );
    this.landsSharedCollection = this.landService.addLandToCollectionIfMissing(this.landsSharedCollection, paymentAdvice.land);
  }

  protected loadRelationshipsOptions(): void {
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

    this.projectLandService
      .query()
      .pipe(map((res: HttpResponse<IProjectLand[]>) => res.body ?? []))
      .pipe(
        map((projectLands: IProjectLand[]) =>
          this.projectLandService.addProjectLandToCollectionIfMissing(projectLands, this.editForm.get('projectLand')!.value)
        )
      )
      .subscribe((projectLands: IProjectLand[]) => (this.projectLandsSharedCollection = projectLands));

    this.surveyService
      .query()
      .pipe(map((res: HttpResponse<ISurvey[]>) => res.body ?? []))
      .pipe(map((surveys: ISurvey[]) => this.surveyService.addSurveyToCollectionIfMissing(surveys, this.editForm.get('survey')!.value)))
      .subscribe((surveys: ISurvey[]) => (this.surveysSharedCollection = surveys));

    this.citizenService
      .query()
      .pipe(map((res: HttpResponse<ICitizen[]>) => res.body ?? []))
      .pipe(
        map((citizens: ICitizen[]) => this.citizenService.addCitizenToCollectionIfMissing(citizens, this.editForm.get('citizen')!.value))
      )
      .subscribe((citizens: ICitizen[]) => (this.citizensSharedCollection = citizens));

    this.paymentFileService
      .query()
      .pipe(map((res: HttpResponse<IPaymentFile[]>) => res.body ?? []))
      .pipe(
        map((paymentFiles: IPaymentFile[]) =>
          this.paymentFileService.addPaymentFileToCollectionIfMissing(paymentFiles, this.editForm.get('paymentFile')!.value)
        )
      )
      .subscribe((paymentFiles: IPaymentFile[]) => (this.paymentFilesSharedCollection = paymentFiles));

    this.landService
      .query()
      .pipe(map((res: HttpResponse<ILand[]>) => res.body ?? []))
      .pipe(map((lands: ILand[]) => this.landService.addLandToCollectionIfMissing(lands, this.editForm.get('land')!.value)))
      .subscribe((lands: ILand[]) => (this.landsSharedCollection = lands));
  }

  protected createFromForm(): IPaymentAdvice {
    return {
      ...new PaymentAdvice(),
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
      landCompensation: this.editForm.get(['landCompensation'])!.value,
      projectLand: this.editForm.get(['projectLand'])!.value,
      survey: this.editForm.get(['survey'])!.value,
      citizen: this.editForm.get(['citizen'])!.value,
      paymentFile: this.editForm.get(['paymentFile'])!.value,
      land: this.editForm.get(['land'])!.value,
    };
  }
}
