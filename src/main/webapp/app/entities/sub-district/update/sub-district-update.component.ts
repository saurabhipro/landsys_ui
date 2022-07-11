import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISubDistrict, SubDistrict } from '../sub-district.model';
import { SubDistrictService } from '../service/sub-district.service';
import { IDistrict } from 'app/entities/district/district.model';
import { DistrictService } from 'app/entities/district/service/district.service';

@Component({
  selector: 'jhi-sub-district-update',
  templateUrl: './sub-district-update.component.html',
})
export class SubDistrictUpdateComponent implements OnInit {
  isSaving = false;

  districtsSharedCollection: IDistrict[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    district: [],
  });

  constructor(
    protected subDistrictService: SubDistrictService,
    protected districtService: DistrictService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subDistrict }) => {
      this.updateForm(subDistrict);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subDistrict = this.createFromForm();
    if (subDistrict.id !== undefined) {
      this.subscribeToSaveResponse(this.subDistrictService.update(subDistrict));
    } else {
      this.subscribeToSaveResponse(this.subDistrictService.create(subDistrict));
    }
  }

  trackDistrictById(_index: number, item: IDistrict): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubDistrict>>): void {
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

  protected updateForm(subDistrict: ISubDistrict): void {
    this.editForm.patchValue({
      id: subDistrict.id,
      name: subDistrict.name,
      district: subDistrict.district,
    });

    this.districtsSharedCollection = this.districtService.addDistrictToCollectionIfMissing(
      this.districtsSharedCollection,
      subDistrict.district
    );
  }

  protected loadRelationshipsOptions(): void {
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

  protected createFromForm(): ISubDistrict {
    return {
      ...new SubDistrict(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      district: this.editForm.get(['district'])!.value,
    };
  }
}
