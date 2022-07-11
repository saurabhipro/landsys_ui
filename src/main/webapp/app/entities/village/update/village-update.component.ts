import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVillage, Village } from '../village.model';
import { VillageService } from '../service/village.service';
import { ISubDistrict } from 'app/entities/sub-district/sub-district.model';
import { SubDistrictService } from 'app/entities/sub-district/service/sub-district.service';

@Component({
  selector: 'jhi-village-update',
  templateUrl: './village-update.component.html',
})
export class VillageUpdateComponent implements OnInit {
  isSaving = false;

  subDistrictsSharedCollection: ISubDistrict[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    subDistrict: [],
  });

  constructor(
    protected villageService: VillageService,
    protected subDistrictService: SubDistrictService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ village }) => {
      this.updateForm(village);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const village = this.createFromForm();
    if (village.id !== undefined) {
      this.subscribeToSaveResponse(this.villageService.update(village));
    } else {
      this.subscribeToSaveResponse(this.villageService.create(village));
    }
  }

  trackSubDistrictById(_index: number, item: ISubDistrict): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVillage>>): void {
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

  protected updateForm(village: IVillage): void {
    this.editForm.patchValue({
      id: village.id,
      name: village.name,
      subDistrict: village.subDistrict,
    });

    this.subDistrictsSharedCollection = this.subDistrictService.addSubDistrictToCollectionIfMissing(
      this.subDistrictsSharedCollection,
      village.subDistrict
    );
  }

  protected loadRelationshipsOptions(): void {
    this.subDistrictService
      .query()
      .pipe(map((res: HttpResponse<ISubDistrict[]>) => res.body ?? []))
      .pipe(
        map((subDistricts: ISubDistrict[]) =>
          this.subDistrictService.addSubDistrictToCollectionIfMissing(subDistricts, this.editForm.get('subDistrict')!.value)
        )
      )
      .subscribe((subDistricts: ISubDistrict[]) => (this.subDistrictsSharedCollection = subDistricts));
  }

  protected createFromForm(): IVillage {
    return {
      ...new Village(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      subDistrict: this.editForm.get(['subDistrict'])!.value,
    };
  }
}
