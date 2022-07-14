import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaymentFile, PaymentFile } from '../payment-file.model';
import { PaymentFileService } from '../service/payment-file.service';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { KhatedarService } from 'app/entities/khatedar/service/khatedar.service';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { PaymentAdviceService } from 'app/entities/payment-advice/service/payment-advice.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';
import { IBank } from 'app/entities/bank/bank.model';
import { BankService } from 'app/entities/bank/service/bank.service';
import { IBankBranch } from 'app/entities/bank-branch/bank-branch.model';
import { BankBranchService } from 'app/entities/bank-branch/service/bank-branch.service';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { LandCompensationService } from 'app/entities/land-compensation/service/land-compensation.service';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';

@Component({
  selector: 'jhi-payment-file-update',
  templateUrl: './payment-file-update.component.html',
})
export class PaymentFileUpdateComponent implements OnInit {
  isSaving = false;
  paymentStatusValues = Object.keys(PaymentStatus);
  paymentAdviceTypeValues = Object.keys(PaymentAdviceType);

  khatedarsCollection: IKhatedar[] = [];
  paymentAdvicesCollection: IPaymentAdvice[] = [];
  projectLandsSharedCollection: IProjectLand[] = [];
  surveysSharedCollection: ISurvey[] = [];
  banksSharedCollection: IBank[] = [];
  bankBranchesSharedCollection: IBankBranch[] = [];
  landCompensationsSharedCollection: ILandCompensation[] = [];

  editForm = this.fb.group({
    id: [],
    paymentFileId: [null, [Validators.required]],
    totalPaymentAmount: [null, [Validators.required]],
    paymentFileDate: [],
    paymentStatus: [null, [Validators.required]],
    bankName: [],
    ifscCode: [],
    paymentMode: [],
    khatedar: [null, Validators.required],
    paymentAdvice: [null, Validators.required],
    projectLand: [null, Validators.required],
    survey: [null, Validators.required],
    bank: [null, Validators.required],
    bankBranch: [null, Validators.required],
    landCompensation: [null, Validators.required],
  });

  constructor(
    protected paymentFileService: PaymentFileService,
    protected khatedarService: KhatedarService,
    protected paymentAdviceService: PaymentAdviceService,
    protected projectLandService: ProjectLandService,
    protected surveyService: SurveyService,
    protected bankService: BankService,
    protected bankBranchService: BankBranchService,
    protected landCompensationService: LandCompensationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paymentFile }) => {
      this.updateForm(paymentFile);

      this.loadRelationshipsOptions();
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

  trackKhatedarById(_index: number, item: IKhatedar): number {
    return item.id!;
  }

  trackPaymentAdviceById(_index: number, item: IPaymentAdvice): number {
    return item.id!;
  }

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  trackSurveyById(_index: number, item: ISurvey): number {
    return item.id!;
  }

  trackBankById(_index: number, item: IBank): number {
    return item.id!;
  }

  trackBankBranchById(_index: number, item: IBankBranch): number {
    return item.id!;
  }

  trackLandCompensationById(_index: number, item: ILandCompensation): number {
    return item.id!;
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
      paymentMode: paymentFile.paymentMode,
      khatedar: paymentFile.khatedar,
      paymentAdvice: paymentFile.paymentAdvice,
      projectLand: paymentFile.projectLand,
      survey: paymentFile.survey,
      bank: paymentFile.bank,
      bankBranch: paymentFile.bankBranch,
      landCompensation: paymentFile.landCompensation,
    });

    this.khatedarsCollection = this.khatedarService.addKhatedarToCollectionIfMissing(this.khatedarsCollection, paymentFile.khatedar);
    this.paymentAdvicesCollection = this.paymentAdviceService.addPaymentAdviceToCollectionIfMissing(
      this.paymentAdvicesCollection,
      paymentFile.paymentAdvice
    );
    this.projectLandsSharedCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsSharedCollection,
      paymentFile.projectLand
    );
    this.surveysSharedCollection = this.surveyService.addSurveyToCollectionIfMissing(this.surveysSharedCollection, paymentFile.survey);
    this.banksSharedCollection = this.bankService.addBankToCollectionIfMissing(this.banksSharedCollection, paymentFile.bank);
    this.bankBranchesSharedCollection = this.bankBranchService.addBankBranchToCollectionIfMissing(
      this.bankBranchesSharedCollection,
      paymentFile.bankBranch
    );
    this.landCompensationsSharedCollection = this.landCompensationService.addLandCompensationToCollectionIfMissing(
      this.landCompensationsSharedCollection,
      paymentFile.landCompensation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.khatedarService
      .query({ 'paymentFileId.specified': 'false' })
      .pipe(map((res: HttpResponse<IKhatedar[]>) => res.body ?? []))
      .pipe(
        map((khatedars: IKhatedar[]) =>
          this.khatedarService.addKhatedarToCollectionIfMissing(khatedars, this.editForm.get('khatedar')!.value)
        )
      )
      .subscribe((khatedars: IKhatedar[]) => (this.khatedarsCollection = khatedars));

    this.paymentAdviceService
      .query({ 'paymentFileId.specified': 'false' })
      .pipe(map((res: HttpResponse<IPaymentAdvice[]>) => res.body ?? []))
      .pipe(
        map((paymentAdvices: IPaymentAdvice[]) =>
          this.paymentAdviceService.addPaymentAdviceToCollectionIfMissing(paymentAdvices, this.editForm.get('paymentAdvice')!.value)
        )
      )
      .subscribe((paymentAdvices: IPaymentAdvice[]) => (this.paymentAdvicesCollection = paymentAdvices));

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

    this.bankService
      .query()
      .pipe(map((res: HttpResponse<IBank[]>) => res.body ?? []))
      .pipe(map((banks: IBank[]) => this.bankService.addBankToCollectionIfMissing(banks, this.editForm.get('bank')!.value)))
      .subscribe((banks: IBank[]) => (this.banksSharedCollection = banks));

    this.bankBranchService
      .query()
      .pipe(map((res: HttpResponse<IBankBranch[]>) => res.body ?? []))
      .pipe(
        map((bankBranches: IBankBranch[]) =>
          this.bankBranchService.addBankBranchToCollectionIfMissing(bankBranches, this.editForm.get('bankBranch')!.value)
        )
      )
      .subscribe((bankBranches: IBankBranch[]) => (this.bankBranchesSharedCollection = bankBranches));

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
      paymentMode: this.editForm.get(['paymentMode'])!.value,
      khatedar: this.editForm.get(['khatedar'])!.value,
      paymentAdvice: this.editForm.get(['paymentAdvice'])!.value,
      projectLand: this.editForm.get(['projectLand'])!.value,
      survey: this.editForm.get(['survey'])!.value,
      bank: this.editForm.get(['bank'])!.value,
      bankBranch: this.editForm.get(['bankBranch'])!.value,
      landCompensation: this.editForm.get(['landCompensation'])!.value,
    };
  }
}
