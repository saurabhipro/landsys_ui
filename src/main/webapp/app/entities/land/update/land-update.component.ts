import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { ILand, Land } from '../land.model';
import { LandService } from '../service/land.service';
import { IProject } from 'app/entities/project/project.model';
import { IVillage } from 'app/entities/village/village.model';
import { VillageService } from 'app/entities/village/service/village.service';
import { IUnit } from 'app/entities/unit/unit.model';
import { UnitService } from 'app/entities/unit/service/unit.service';
import { ILandType } from 'app/entities/land-type/land-type.model';
import { LandTypeService } from 'app/entities/land-type/service/land-type.service';
import { IDistrict } from 'app/entities/district/district.model';
import { DistrictService } from 'app/entities/district/service/district.service';

@Component({
  selector: 'jhi-land-update',
  templateUrl: './land-update.component.html',
})
export class LandUpdateComponent implements OnInit {
  isSaving = false;

  villagesSharedCollection: IVillage[] = [];
  unitsSharedCollection: IUnit[] = [];
  landTypesSharedCollection: ILandType[] = [];
  districtsSharedCollection: IDistrict[] = [];
  selectedProject: IProject | null = null;

  editForm = this.fb.group({
    id: [],
    project: [],
    khasraNumber: [null, [Validators.required]],
    khatauni: [],
    area: [],
    landMarketValue: [],
    structuralValue: [],
    horticultureValue: [],
    forestValue: [],
    distanceFromCity: [],
    totalLandValue: [],
    village: [null, Validators.required],
    landUnit: [null, Validators.required],
    landType: [null, Validators.required],
    district: [null, Validators.required],
  });

  constructor(
    protected landService: LandService,
    protected villageService: VillageService,
    protected unitService: UnitService,
    protected landTypeService: LandTypeService,
    protected districtService: DistrictService,
    protected activatedRoute: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.selectedProject = this.sessionStorageService.retrieve('ContextProject').name;
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
      console.log('UPDATING LAND..');
      this.subscribeToSaveResponse(this.landService.update(land));
    } else {
      console.log('CREATING LAND');
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

  trackDistrictById(_index: number, item: IDistrict): number {
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
    this.isSaving = false;
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(land: ILand): void {
    console.log('Selected Project:');
    console.log(this.selectedProject);
    this.editForm.patchValue({
      id: land.id,
      project: this.selectedProject,
      khasraNumber: land.khasraNumber,
      khatauni: land.khatauni,
      area: land.area,
      landMarketValue: land.landMarketValue,
      structuralValue: land.structuralValue,
      horticultureValue: land.horticultureValue,
      forestValue: land.forestValue,
      distanceFromCity: land.distanceFromCity,
      totalLandValue: land.totalLandValue,
      village: land.village,
      landUnit: land.landUnit,
      landType: land.landType,
      district: land.district,
    });

    this.villagesSharedCollection = this.villageService.addVillageToCollectionIfMissing(this.villagesSharedCollection, land.village);
    this.unitsSharedCollection = this.unitService.addUnitToCollectionIfMissing(this.unitsSharedCollection, land.landUnit);
    this.landTypesSharedCollection = this.landTypeService.addLandTypeToCollectionIfMissing(this.landTypesSharedCollection, land.landType);
    this.districtsSharedCollection = this.districtService.addDistrictToCollectionIfMissing(this.districtsSharedCollection, land.district);
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
      .pipe(map((units: IUnit[]) => this.unitService.addUnitToCollectionIfMissing(units, this.editForm.get('landUnit')!.value)))
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

    this.districtService
      .query()
      .pipe(map((res: HttpResponse<IDistrict[]>) => res.body ?? []))
      .pipe(
        map((districts: IDistrict[]) =>
          this.districtService.addDistrictToCollectionIfMissing(districts, this.editForm.get('district')!.value)
        )
      )
      .subscribe((districts: IDistrict[]) => (this.districtsSharedCollection = districts));
  }

  protected createFromForm(): ILand {
    return {
      ...new Land(),
      id: this.editForm.get(['id'])!.value,
      project: this.editForm.get(['project'])!.value,
      khasraNumber: this.editForm.get(['khasraNumber'])!.value,
      khatauni: this.editForm.get(['khatauni'])!.value,
      area: this.editForm.get(['area'])!.value,
      landMarketValue: this.editForm.get(['landMarketValue'])!.value,
      structuralValue: this.editForm.get(['structuralValue'])!.value,
      horticultureValue: this.editForm.get(['horticultureValue'])!.value,
      forestValue: this.editForm.get(['forestValue'])!.value,
      distanceFromCity: this.editForm.get(['distanceFromCity'])!.value,
      totalLandValue: this.editForm.get(['totalLandValue'])!.value,
      village: this.editForm.get(['village'])!.value,
      landUnit: this.editForm.get(['landUnit'])!.value,
      landType: this.editForm.get(['landType'])!.value,
      district: this.editForm.get(['district'])!.value,
    };
  }
}
