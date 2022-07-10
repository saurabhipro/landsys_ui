import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILandType, LandType } from '../land-type.model';
import { LandTypeService } from '../service/land-type.service';

@Component({
  selector: 'jhi-land-type-update',
  templateUrl: './land-type-update.component.html',
})
export class LandTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  constructor(protected landTypeService: LandTypeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ landType }) => {
      this.updateForm(landType);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const landType = this.createFromForm();
    if (landType.id !== undefined) {
      this.subscribeToSaveResponse(this.landTypeService.update(landType));
    } else {
      this.subscribeToSaveResponse(this.landTypeService.create(landType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILandType>>): void {
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

  protected updateForm(landType: ILandType): void {
    this.editForm.patchValue({
      id: landType.id,
      name: landType.name,
      description: landType.description,
    });
  }

  protected createFromForm(): ILandType {
    return {
      ...new LandType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
