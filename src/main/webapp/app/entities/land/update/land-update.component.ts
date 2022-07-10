import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILand, Land } from '../land.model';
import { LandService } from '../service/land.service';
import { IState } from 'app/entities/state/state.model';
import { StateService } from 'app/entities/state/service/state.service';
import { IVillage } from 'app/entities/village/village.model';
import { VillageService } from 'app/entities/village/service/village.service';
import { ILandType } from 'app/entities/land-type/land-type.model';
import { LandTypeService } from 'app/entities/land-type/service/land-type.service';
import { IUnit } from 'app/entities/unit/unit.model';
import { UnitService } from 'app/entities/unit/service/unit.service';

@Component({
  selector: 'jhi-land-update',
  templateUrl: './land-update.component.html',
})
export class LandUpdateComponent implements OnInit {
  isSaving = false;

  statesCollection: IState[] = [];
  villagesSharedCollection: IVillage[] = [];
  landTypesSharedCollection: ILandType[] = [];
  unitsSharedCollection: IUnit[] = [];

  editForm = this.fb.group({
    id: [],
    ulpin: [],
    khasraNumber: [null, [Validators.required]],
    area: [],
    landMarketValue: [],
    structuralValue: [],
    horticultureValue: [],
    forestValue: [],
    distanceFromCity: [],
    totalLandValue: [],
    state: [],
    village: [null, Validators.required],
    landType: [null, Validators.required],
    unit: [],
  });

  constructor(
    protected landService: LandService,
    protected stateService: StateService,
    protected villageService: VillageService,
    protected landTypeService: LandTypeService,
    protected unitService: UnitService,
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

  trackStateById(_index: number, item: IState): number {
    return item.id!;
  }

  trackVillageById(_index: number, item: IVillage): number {
    return item.id!;
  }

  trackLandTypeById(_index: number, item: ILandType): number {
    return item.id!;
  }

  trackUnitById(_index: number, item: IUnit): number {
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
      area: land.area,
      landMarketValue: land.landMarketValue,
      structuralValue: land.structuralValue,
      horticultureValue: land.horticultureValue,
      forestValue: land.forestValue,
      distanceFromCity: land.distanceFromCity,
      totalLandValue: land.totalLandValue,
      state: land.state,
      village: land.village,
      landType: land.landType,
      unit: land.unit,
    });

    this.statesCollection = this.stateService.addStateToCollectionIfMissing(this.statesCollection, land.state);
    this.villagesSharedCollection = this.villageService.addVillageToCollectionIfMissing(this.villagesSharedCollection, land.village);
    this.landTypesSharedCollection = this.landTypeService.addLandTypeToCollectionIfMissing(this.landTypesSharedCollection, land.landType);
    this.unitsSharedCollection = this.unitService.addUnitToCollectionIfMissing(this.unitsSharedCollection, land.unit);
  }

  protected loadRelationshipsOptions(): void {
    this.stateService
      .query({ filter: 'land-is-null' })
      .pipe(map((res: HttpResponse<IState[]>) => res.body ?? []))
      .pipe(map((states: IState[]) => this.stateService.addStateToCollectionIfMissing(states, this.editForm.get('state')!.value)))
      .subscribe((states: IState[]) => (this.statesCollection = states));

    this.villageService
      .query()
      .pipe(map((res: HttpResponse<IVillage[]>) => res.body ?? []))
      .pipe(
        map((villages: IVillage[]) => this.villageService.addVillageToCollectionIfMissing(villages, this.editForm.get('village')!.value))
      )
      .subscribe((villages: IVillage[]) => (this.villagesSharedCollection = villages));

    this.landTypeService
      .query()
      .pipe(map((res: HttpResponse<ILandType[]>) => res.body ?? []))
      .pipe(
        map((landTypes: ILandType[]) =>
          this.landTypeService.addLandTypeToCollectionIfMissing(landTypes, this.editForm.get('landType')!.value)
        )
      )
      .subscribe((landTypes: ILandType[]) => (this.landTypesSharedCollection = landTypes));

    this.unitService
      .query()
      .pipe(map((res: HttpResponse<IUnit[]>) => res.body ?? []))
      .pipe(map((units: IUnit[]) => this.unitService.addUnitToCollectionIfMissing(units, this.editForm.get('unit')!.value)))
      .subscribe((units: IUnit[]) => (this.unitsSharedCollection = units));
  }

  protected createFromForm(): ILand {
    return {
      ...new Land(),
      id: this.editForm.get(['id'])!.value,
      ulpin: this.editForm.get(['ulpin'])!.value,
      khasraNumber: this.editForm.get(['khasraNumber'])!.value,
      area: this.editForm.get(['area'])!.value,
      landMarketValue: this.editForm.get(['landMarketValue'])!.value,
      structuralValue: this.editForm.get(['structuralValue'])!.value,
      horticultureValue: this.editForm.get(['horticultureValue'])!.value,
      forestValue: this.editForm.get(['forestValue'])!.value,
      distanceFromCity: this.editForm.get(['distanceFromCity'])!.value,
      totalLandValue: this.editForm.get(['totalLandValue'])!.value,
      state: this.editForm.get(['state'])!.value,
      village: this.editForm.get(['village'])!.value,
      landType: this.editForm.get(['landType'])!.value,
      unit: this.editForm.get(['unit'])!.value,
    };
  }
}
