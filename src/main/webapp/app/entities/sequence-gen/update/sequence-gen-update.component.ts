import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISequenceGen, SequenceGen } from '../sequence-gen.model';
import { SequenceGenService } from '../service/sequence-gen.service';
import { SequenceType } from 'app/entities/enumerations/sequence-type.model';

@Component({
  selector: 'jhi-sequence-gen-update',
  templateUrl: './sequence-gen-update.component.html',
})
export class SequenceGenUpdateComponent implements OnInit {
  isSaving = false;
  sequenceTypeValues = Object.keys(SequenceType);

  editForm = this.fb.group({
    id: [],
    seqType: [null, [Validators.required]],
    latestSequence: [null, [Validators.required]],
    sequenceSuffix: [null, [Validators.required]],
  });

  constructor(protected sequenceGenService: SequenceGenService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sequenceGen }) => {
      this.updateForm(sequenceGen);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sequenceGen = this.createFromForm();
    if (sequenceGen.id !== undefined) {
      this.subscribeToSaveResponse(this.sequenceGenService.update(sequenceGen));
    } else {
      this.subscribeToSaveResponse(this.sequenceGenService.create(sequenceGen));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISequenceGen>>): void {
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

  protected updateForm(sequenceGen: ISequenceGen): void {
    this.editForm.patchValue({
      id: sequenceGen.id,
      seqType: sequenceGen.seqType,
      latestSequence: sequenceGen.latestSequence,
      sequenceSuffix: sequenceGen.sequenceSuffix,
    });
  }

  protected createFromForm(): ISequenceGen {
    return {
      ...new SequenceGen(),
      id: this.editForm.get(['id'])!.value,
      seqType: this.editForm.get(['seqType'])!.value,
      latestSequence: this.editForm.get(['latestSequence'])!.value,
      sequenceSuffix: this.editForm.get(['sequenceSuffix'])!.value,
    };
  }
}
