import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ILandCompensation, LandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { LandCompensationService } from 'app/entities/land-compensation/service/land-compensation.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { CompensationStatus } from 'app/entities/enumerations/compensation-status.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-land-compensation-create',
  templateUrl: './land-compensation-create.component.html',
})
export class LandCompensationCreateComponent implements OnInit {
  isSaving = false;
  hissaTypeValues = Object.keys(HissaType);
  compensationStatusValues = Object.keys(CompensationStatus);
  
  projectLandsCollection: IProjectLand[] = [];
  surveysCollection: ISurvey[] = [];

  @Input() survey!:ISurvey;


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
    interestRate: [],
    interestDays: [],
    transactionId: [],
    projectLand: [null, Validators.required],
    survey: [null, Validators.required],
  });

  constructor(
    protected landCompensationService: LandCompensationService,
    protected projectLandService: ProjectLandService,
    protected surveyService: SurveyService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
      if(this.survey.id !=null){
        const landCompensation : ILandCompensation = {
          hissaType:this.survey.hissaType,
          area: this.survey.area,
          landMarketValue: this.survey.landMarketValue,
          structuralCompensation: this.survey.structuralValue,
          horticultureCompensation: this.survey.horticultureValue,
          forestCompensation: this.survey.forestValue,
          projectLand: this.survey.projectLand,
          survey: this.survey
        }
        this.updateForm(landCompensation);
        this.loadRelationshipsOptions();
      }else{
        this.activeModal.close();
      }
     
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

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  trackSurveyById(_index: number, item: ISurvey): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILandCompensation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.activeModal.close();
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
      status: landCompensation.compensationStatus,
      orderDate: landCompensation.orderDate,
      paymentAmount: landCompensation.paymentAmount,
      interestRate: landCompensation.interestRate,
      interestDays: landCompensation.interestDays,
      transactionId: landCompensation.transactionId,
      projectLand: landCompensation.projectLand,
      survey: landCompensation.survey,
    });

    this.projectLandsCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsCollection,
      landCompensation.projectLand
    );
    this.surveysCollection = this.surveyService.addSurveyToCollectionIfMissing(this.surveysCollection, landCompensation.survey);
  }

  protected loadRelationshipsOptions(): void {
    this.projectLandService
      .query({ filter: 'landcompensation-is-null' })
      .pipe(map((res: HttpResponse<IProjectLand[]>) => res.body ?? []))
      .pipe(
        map((projectLands: IProjectLand[]) =>
          this.projectLandService.addProjectLandToCollectionIfMissing(projectLands, this.editForm.get('projectLand')!.value)
        )
      )
      .subscribe((projectLands: IProjectLand[]) => (this.projectLandsCollection = projectLands));

    this.surveyService
      .query({ 'landCompensationId.specified': 'false' })
      .pipe(map((res: HttpResponse<ISurvey[]>) => res.body ?? []))
      .pipe(map((surveys: ISurvey[]) => this.surveyService.addSurveyToCollectionIfMissing(surveys, this.editForm.get('survey')!.value)))
      .subscribe((surveys: ISurvey[]) => (this.surveysCollection = surveys));
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
      compensationStatus: this.editForm.get(['status'])!.value,
      orderDate: this.editForm.get(['orderDate'])!.value,
      paymentAmount: this.editForm.get(['paymentAmount'])!.value,
      interestRate: this.editForm.get(['interestRate'])!.value,
      interestDays: this.editForm.get(['interestDays'])!.value,
      transactionId: this.editForm.get(['transactionId'])!.value,
      projectLand: this.editForm.get(['projectLand'])!.value,
      survey: this.editForm.get(['survey'])!.value,
    };
  }
}
