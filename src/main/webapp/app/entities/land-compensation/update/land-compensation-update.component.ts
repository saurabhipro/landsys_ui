import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILandCompensation, LandCompensation } from '../land-compensation.model';
import { LandCompensationService } from '../service/land-compensation.service';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { KhatedarService } from 'app/entities/khatedar/service/khatedar.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { CompensationStatus } from 'app/entities/enumerations/compensation-status.model';

@Component({
  selector: 'jhi-land-compensation-update',
  templateUrl: './land-compensation-update.component.html',
})
export class LandCompensationUpdateComponent implements OnInit {
  isSaving = false;
  hissaTypeValues = Object.keys(HissaType);
  compensationStatusValues = Object.keys(CompensationStatus);

  khatedarsSharedCollection: IKhatedar[] = [];
  surveysSharedCollection: ISurvey[] = [];
  projectLandsSharedCollection: IProjectLand[] = [];

  editForm = this.fb.group({
    id: [],
    hissaType: [null, [Validators.required]],
    area: [null, [Validators.required]],
    sharePercentage: [null, [Validators.required]],
    landMarketValue: [null, [Validators.required]],
    structuralCompensation: [],
    horticultureCompensation: [],
    forestCompensation: [],
    solatiumMoney: [],
    additionalCompensation: [],
    status: [],
    orderDate: [],
    paymentAmount: [],
    transactionId: [],
    khatedar: [],
    survey: [],
    projectLand: [],
  });

  constructor(
    protected landCompensationService: LandCompensationService,
    protected khatedarService: KhatedarService,
    protected surveyService: SurveyService,
    protected projectLandService: ProjectLandService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ landCompensation }) => {
      this.updateForm(landCompensation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const landCompensation = this.createFromForm();
    if (landCompensation.id !== undefined) {
      this.subscribeToSaveResponse(this.landCompensationService.update(landCompensation));
    } else {
      this.subscribeToSaveResponse(this.landCompensationService.create(landCompensation));
    }
  }

  trackKhatedarById(_index: number, item: IKhatedar): number {
    return item.id!;
  }

  trackSurveyById(_index: number, item: ISurvey): number {
    return item.id!;
  }

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILandCompensation>>): void {
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

  protected updateForm(landCompensation: ILandCompensation): void {
    this.editForm.patchValue({
      id: landCompensation.id,
      hissaType: landCompensation.hissaType,
      area: landCompensation.area,
      sharePercentage: landCompensation.sharePercentage,
      landMarketValue: landCompensation.landMarketValue,
      structuralCompensation: landCompensation.structuralCompensation,
      horticultureCompensation: landCompensation.horticultureCompensation,
      forestCompensation: landCompensation.forestCompensation,
      solatiumMoney: landCompensation.solatiumMoney,
      additionalCompensation: landCompensation.additionalCompensation,
      status: landCompensation.status,
      orderDate: landCompensation.orderDate,
      paymentAmount: landCompensation.paymentAmount,
      transactionId: landCompensation.transactionId,
      khatedar: landCompensation.khatedar,
      survey: landCompensation.survey,
      projectLand: landCompensation.projectLand,
    });

    this.khatedarsSharedCollection = this.khatedarService.addKhatedarToCollectionIfMissing(
      this.khatedarsSharedCollection,
      landCompensation.khatedar
    );
    this.surveysSharedCollection = this.surveyService.addSurveyToCollectionIfMissing(this.surveysSharedCollection, landCompensation.survey);
    this.projectLandsSharedCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsSharedCollection,
      landCompensation.projectLand
    );
  }

  protected loadRelationshipsOptions(): void {
    this.khatedarService
      .query()
      .pipe(map((res: HttpResponse<IKhatedar[]>) => res.body ?? []))
      .pipe(
        map((khatedars: IKhatedar[]) =>
          this.khatedarService.addKhatedarToCollectionIfMissing(khatedars, this.editForm.get('khatedar')!.value)
        )
      )
      .subscribe((khatedars: IKhatedar[]) => (this.khatedarsSharedCollection = khatedars));

    this.surveyService
      .query()
      .pipe(map((res: HttpResponse<ISurvey[]>) => res.body ?? []))
      .pipe(map((surveys: ISurvey[]) => this.surveyService.addSurveyToCollectionIfMissing(surveys, this.editForm.get('survey')!.value)))
      .subscribe((surveys: ISurvey[]) => (this.surveysSharedCollection = surveys));

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

  protected createFromForm(): ILandCompensation {
    return {
      ...new LandCompensation(),
      id: this.editForm.get(['id'])!.value,
      hissaType: this.editForm.get(['hissaType'])!.value,
      area: this.editForm.get(['area'])!.value,
      sharePercentage: this.editForm.get(['sharePercentage'])!.value,
      landMarketValue: this.editForm.get(['landMarketValue'])!.value,
      structuralCompensation: this.editForm.get(['structuralCompensation'])!.value,
      horticultureCompensation: this.editForm.get(['horticultureCompensation'])!.value,
      forestCompensation: this.editForm.get(['forestCompensation'])!.value,
      solatiumMoney: this.editForm.get(['solatiumMoney'])!.value,
      additionalCompensation: this.editForm.get(['additionalCompensation'])!.value,
      status: this.editForm.get(['status'])!.value,
      orderDate: this.editForm.get(['orderDate'])!.value,
      paymentAmount: this.editForm.get(['paymentAmount'])!.value,
      transactionId: this.editForm.get(['transactionId'])!.value,
      khatedar: this.editForm.get(['khatedar'])!.value,
      survey: this.editForm.get(['survey'])!.value,
      projectLand: this.editForm.get(['projectLand'])!.value,
    };
  }
}
