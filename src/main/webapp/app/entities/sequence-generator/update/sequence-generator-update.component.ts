import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISequenceGenerator, SequenceGenerator } from '../sequence-generator.model';
import { SequenceGeneratorService } from '../service/sequence-generator.service';
import { SequenceType } from 'app/entities/enumerations/sequence-type.model';

@Component({
  selector: 'jhi-sequence-generator-update',
  templateUrl: './sequence-generator-update.component.html',
})
export class SequenceGeneratorUpdateComponent implements OnInit {
  isSaving = false;
  sequenceTypeValues = Object.keys(SequenceType);

  editForm = this.fb.group({
    id: [],
    seqType: [null, [Validators.required]],
    latestSequence: [null, [Validators.required]],
    sequenceSuffix: [null, [Validators.required]],
  });

  constructor(
    protected sequenceGeneratorService: SequenceGeneratorService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sequenceGenerator }) => {
      this.updateForm(sequenceGenerator);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sequenceGenerator = this.createFromForm();
    if (sequenceGenerator.id !== undefined) {
      this.subscribeToSaveResponse(this.sequenceGeneratorService.update(sequenceGenerator));
    } else {
      this.subscribeToSaveResponse(this.sequenceGeneratorService.create(sequenceGenerator));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISequenceGenerator>>): void {
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

  protected updateForm(sequenceGenerator: ISequenceGenerator): void {
    this.editForm.patchValue({
      id: sequenceGenerator.id,
      seqType: sequenceGenerator.seqType,
      latestSequence: sequenceGenerator.latestSequence,
      sequenceSuffix: sequenceGenerator.sequenceSuffix,
    });
  }

  protected createFromForm(): ISequenceGenerator {
    return {
      ...new SequenceGenerator(),
      id: this.editForm.get(['id'])!.value,
      seqType: this.editForm.get(['seqType'])!.value,
      latestSequence: this.editForm.get(['latestSequence'])!.value,
      sequenceSuffix: this.editForm.get(['sequenceSuffix'])!.value,
    };
  }
}
