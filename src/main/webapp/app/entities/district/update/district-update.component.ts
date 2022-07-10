import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDistrict, District } from '../district.model';
import { DistrictService } from '../service/district.service';
import { IState } from 'app/entities/state/state.model';
import { StateService } from 'app/entities/state/service/state.service';

@Component({
  selector: 'jhi-district-update',
  templateUrl: './district-update.component.html',
})
export class DistrictUpdateComponent implements OnInit {
  isSaving = false;

  statesSharedCollection: IState[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    state: [null, Validators.required],
  });

  constructor(
    protected districtService: DistrictService,
    protected stateService: StateService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ district }) => {
      this.updateForm(district);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const district = this.createFromForm();
    if (district.id !== undefined) {
      this.subscribeToSaveResponse(this.districtService.update(district));
    } else {
      this.subscribeToSaveResponse(this.districtService.create(district));
    }
  }

  trackStateById(_index: number, item: IState): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDistrict>>): void {
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

  protected updateForm(district: IDistrict): void {
    this.editForm.patchValue({
      id: district.id,
      name: district.name,
      state: district.state,
    });

    this.statesSharedCollection = this.stateService.addStateToCollectionIfMissing(this.statesSharedCollection, district.state);
  }

  protected loadRelationshipsOptions(): void {
    this.stateService
      .query()
      .pipe(map((res: HttpResponse<IState[]>) => res.body ?? []))
      .pipe(map((states: IState[]) => this.stateService.addStateToCollectionIfMissing(states, this.editForm.get('state')!.value)))
      .subscribe((states: IState[]) => (this.statesSharedCollection = states));
  }

  protected createFromForm(): IDistrict {
    return {
      ...new District(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      state: this.editForm.get(['state'])!.value,
    };
  }
}
