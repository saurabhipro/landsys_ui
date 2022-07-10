import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IState, State } from '../state.model';
import { StateService } from '../service/state.service';

@Component({
  selector: 'jhi-state-update',
  templateUrl: './state-update.component.html',
})
export class StateUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
  });

  constructor(protected stateService: StateService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ state }) => {
      this.updateForm(state);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const state = this.createFromForm();
    if (state.id !== undefined) {
      this.subscribeToSaveResponse(this.stateService.update(state));
    } else {
      this.subscribeToSaveResponse(this.stateService.create(state));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IState>>): void {
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

  protected updateForm(state: IState): void {
    this.editForm.patchValue({
      id: state.id,
      name: state.name,
    });
  }

  protected createFromForm(): IState {
    return {
      ...new State(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
