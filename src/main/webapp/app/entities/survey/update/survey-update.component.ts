import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISurvey, Survey } from '../survey.model';
import { SurveyService } from '../service/survey.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { SurveyStatus } from 'app/entities/enumerations/survey-status.model';
import { IProject } from 'app/entities/project/project.model';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'jhi-survey-update',
  templateUrl: './survey-update.component.html',
})
export class SurveyUpdateComponent implements OnInit {
  isSaving = false;
  hissaTypeValues = Object.keys(HissaType);
  surveyStatusValues = Object.keys(SurveyStatus);
  selectedProject: IProject | null = null;
  projectLandsCollection: IProjectLand[] = [];

  editForm = this.fb.group({
    selectedProject: this.selectedProject?.name,
    id: [],
    surveyor: [null, [Validators.required]],
    hissaType: [null, [Validators.required]],
    // sharePercentage: [null, [Validators.required]],
    area: [null, [Validators.required]],
    landMarketValue: [null, [Validators.required]],
    structuralValue: [],
    horticultureValue: [],
    forestValue: [],
    distanceFromCity: [],
    remarks: [],
    status: [],
    projectLand: [null, Validators.required],
  });

  constructor(
    protected surveyService: SurveyService,
    protected projectLandService: ProjectLandService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ survey }) => {
      this.updateForm(survey);

      this.loadRelationshipsOptions();
    });
    this.selectedProject = this.sessionStorageService.retrieve("ContextProject");
    this.sessionStorageService.observe("ContextProject").subscribe(project => (this.selectedProject = project as IProject));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const survey = this.createFromForm();
    if (survey.id !== undefined) {
      this.subscribeToSaveResponse(this.surveyService.update(survey));
    } else {
      this.subscribeToSaveResponse(this.surveyService.create(survey));
    }
  }

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISurvey>>): void {
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

  protected updateForm(survey: ISurvey): void {
    this.editForm.patchValue({
      id: survey.id,
      surveyor: survey.surveyor,
      hissaType: survey.hissaType,
      // sharePercentage: survey.sharePercentage,
      area: survey.area,
      landMarketValue: survey.landMarketValue,
      structuralValue: survey.structuralValue,
      horticultureValue: survey.horticultureValue,
      forestValue: survey.forestValue,
      distanceFromCity: survey.distanceFromCity,
      remarks: survey.remarks,
      status: survey.surveyStatus,
      projectLand: survey.projectLand,
      selectedProject: this.selectedProject?.name
    });

    this.projectLandsCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsCollection,
      survey.projectLand
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectLandService
      .query({ filter: 'survey-is-null' })
      .pipe(map((res: HttpResponse<IProjectLand[]>) => res.body ?? []))
      .pipe(
        map((projectLands: IProjectLand[]) =>
          this.projectLandService.addProjectLandToCollectionIfMissing(projectLands, this.editForm.get('projectLand')!.value)
        )
      )
      .subscribe((projectLands: IProjectLand[]) => (this.projectLandsCollection = projectLands));
  }

  protected createFromForm(): ISurvey {
    return {
      ...new Survey(),
      id: this.editForm.get(['id'])!.value,
      surveyor: this.editForm.get(['surveyor'])!.value,
      hissaType: this.editForm.get(['hissaType'])!.value,
      // sharePercentage: this.editForm.get(['sharePercentage'])!.value,
      area: this.editForm.get(['area'])!.value,
      landMarketValue: this.editForm.get(['landMarketValue'])!.value,
      structuralValue: this.editForm.get(['structuralValue'])!.value,
      horticultureValue: this.editForm.get(['horticultureValue'])!.value,
      forestValue: this.editForm.get(['forestValue'])!.value,
      distanceFromCity: this.editForm.get(['distanceFromCity'])!.value,
      remarks: this.editForm.get(['remarks'])!.value,
      surveyStatus: this.editForm.get(['status'])!.value,
      projectLand: this.editForm.get(['projectLand'])!.value,
    };
  }
}
