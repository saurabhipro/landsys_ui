import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILand, Land } from '../land.model';
import { LandService } from '../service/land.service';
import { IVillage } from 'app/entities/village/village.model';
import { VillageService } from 'app/entities/village/service/village.service';
import { IUnit } from 'app/entities/unit/unit.model';
import { UnitService } from 'app/entities/unit/service/unit.service';
import { ILandType } from 'app/entities/land-type/land-type.model';
import { LandTypeService } from 'app/entities/land-type/service/land-type.service';
import { IState } from 'app/entities/state/state.model';
import { StateService } from 'app/entities/state/service/state.service';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { CitizenService } from 'app/entities/citizen/service/citizen.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

@Component({
  selector: 'jhi-land-update',
  templateUrl: './land-update.component.html',
})
export class LandUpdateComponent implements OnInit {
  isSaving = false;

  villagesSharedCollection: IVillage[] = [];
  unitsSharedCollection: IUnit[] = [];
  landTypesSharedCollection: ILandType[] = [];
  statesSharedCollection: IState[] = [];
  citizensSharedCollection: ICitizen[] = [];
  projectsSharedCollection: IProject[] = [];

  editForm = this.fb.group({
    id: [],
    ulpin: [],
    khasraNumber: [null, [Validators.required]],
    kahtauniKhata: [],
    area: [],
    landMarketValue: [],
    structuralValue: [],
    horticultureValue: [],
    forestValue: [],
    distanceFromCity: [],
    totalLandValue: [],
    village: [null, Validators.required],
    unit: [null, Validators.required],
    landType: [null, Validators.required],
    state: [null, Validators.required],
    citizen: [],
    project: [],
  });

  constructor(
    protected landService: LandService,
    protected villageService: VillageService,
    protected unitService: UnitService,
    protected landTypeService: LandTypeService,
    protected stateService: StateService,
    protected citizenService: CitizenService,
    protected projectService: ProjectService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ land }) => {
      this.updateForm(land);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const land = this.createFromForm();
    if (land.id !== undefined) {
      this.subscribeToSaveResponse(this.landService.update(land));
    } else {
      this.subscribeToSaveResponse(this.landService.create(land));
    }
  }

  trackVillageById(_index: number, item: IVillage): number {
    return item.id!;
  }

  trackUnitById(_index: number, item: IUnit): number {
    return item.id!;
  }

  trackLandTypeById(_index: number, item: ILandType): number {
    return item.id!;
  }

  trackStateById(_index: number, item: IState): number {
    return item.id!;
  }

  trackCitizenById(_index: number, item: ICitizen): number {
    return item.id!;
  }

  trackProjectById(_index: number, item: IProject): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILand>>): void {
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

  protected updateForm(land: ILand): void {
    this.editForm.patchValue({
      id: land.id,
      ulpin: land.ulpin,
      khasraNumber: land.khasraNumber,
      kahtauniKhata: land.kahtauniKhata,
      area: land.area,
      landMarketValue: land.landMarketValue,
      structuralValue: land.structuralValue,
      horticultureValue: land.horticultureValue,
      forestValue: land.forestValue,
      distanceFromCity: land.distanceFromCity,
      totalLandValue: land.totalLandValue,
      village: land.village,
      unit: land.unit,
      landType: land.landType,
      state: land.state,
      citizen: land.citizen,
      project: land.project,
    });

    this.villagesSharedCollection = this.villageService.addVillageToCollectionIfMissing(this.villagesSharedCollection, land.village);
    this.unitsSharedCollection = this.unitService.addUnitToCollectionIfMissing(this.unitsSharedCollection, land.unit);
    this.landTypesSharedCollection = this.landTypeService.addLandTypeToCollectionIfMissing(this.landTypesSharedCollection, land.landType);
    this.statesSharedCollection = this.stateService.addStateToCollectionIfMissing(this.statesSharedCollection, land.state);
    this.citizensSharedCollection = this.citizenService.addCitizenToCollectionIfMissing(this.citizensSharedCollection, land.citizen);
    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing(this.projectsSharedCollection, land.project);
  }

  protected loadRelationshipsOptions(): void {
    this.villageService
      .query()
      .pipe(map((res: HttpResponse<IVillage[]>) => res.body ?? []))
      .pipe(
        map((villages: IVillage[]) => this.villageService.addVillageToCollectionIfMissing(villages, this.editForm.get('village')!.value))
      )
      .subscribe((villages: IVillage[]) => (this.villagesSharedCollection = villages));

    this.unitService
      .query()
      .pipe(map((res: HttpResponse<IUnit[]>) => res.body ?? []))
      .pipe(map((units: IUnit[]) => this.unitService.addUnitToCollectionIfMissing(units, this.editForm.get('unit')!.value)))
      .subscribe((units: IUnit[]) => (this.unitsSharedCollection = units));

    this.landTypeService
      .query()
      .pipe(map((res: HttpResponse<ILandType[]>) => res.body ?? []))
      .pipe(
        map((landTypes: ILandType[]) =>
          this.landTypeService.addLandTypeToCollectionIfMissing(landTypes, this.editForm.get('landType')!.value)
        )
      )
      .subscribe((landTypes: ILandType[]) => (this.landTypesSharedCollection = landTypes));

    this.stateService
      .query()
      .pipe(map((res: HttpResponse<IState[]>) => res.body ?? []))
      .pipe(map((states: IState[]) => this.stateService.addStateToCollectionIfMissing(states, this.editForm.get('state')!.value)))
      .subscribe((states: IState[]) => (this.statesSharedCollection = states));

    this.citizenService
      .query()
      .pipe(map((res: HttpResponse<ICitizen[]>) => res.body ?? []))
      .pipe(
        map((citizens: ICitizen[]) => this.citizenService.addCitizenToCollectionIfMissing(citizens, this.editForm.get('citizen')!.value))
      )
      .subscribe((citizens: ICitizen[]) => (this.citizensSharedCollection = citizens));

    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(
        map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing(projects, this.editForm.get('project')!.value))
      )
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));
  }

  protected createFromForm(): ILand {
    return {
      ...new Land(),
      id: this.editForm.get(['id'])!.value,
      ulpin: this.editForm.get(['ulpin'])!.value,
      khasraNumber: this.editForm.get(['khasraNumber'])!.value,
      kahtauniKhata: this.editForm.get(['kahtauniKhata'])!.value,
      area: this.editForm.get(['area'])!.value,
      landMarketValue: this.editForm.get(['landMarketValue'])!.value,
      structuralValue: this.editForm.get(['structuralValue'])!.value,
      horticultureValue: this.editForm.get(['horticultureValue'])!.value,
      forestValue: this.editForm.get(['forestValue'])!.value,
      distanceFromCity: this.editForm.get(['distanceFromCity'])!.value,
      totalLandValue: this.editForm.get(['totalLandValue'])!.value,
      village: this.editForm.get(['village'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      landType: this.editForm.get(['landType'])!.value,
      state: this.editForm.get(['state'])!.value,
      citizen: this.editForm.get(['citizen'])!.value,
      project: this.editForm.get(['project'])!.value,
    };
  }
}
