import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPublicNotification, PublicNotification } from '../public-notification.model';
import { PublicNotificationService } from '../service/public-notification.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-public-notification-update',
  templateUrl: './public-notification-update.component.html',
})
export class PublicNotificationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    file: [],
    fileContentType: [],
    description: [null, [Validators.required]],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected publicNotificationService: PublicNotificationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ publicNotification }) => {
      this.updateForm(publicNotification);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('jhipsterApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const publicNotification = this.createFromForm();
    if (publicNotification.id !== undefined) {
      this.subscribeToSaveResponse(this.publicNotificationService.update(publicNotification));
    } else {
      this.subscribeToSaveResponse(this.publicNotificationService.create(publicNotification));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPublicNotification>>): void {
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

  protected updateForm(publicNotification: IPublicNotification): void {
    this.editForm.patchValue({
      id: publicNotification.id,
      date: publicNotification.date,
      file: publicNotification.file,
      fileContentType: publicNotification.fileContentType,
      description: publicNotification.description,
    });
  }

  protected createFromForm(): IPublicNotification {
    return {
      ...new PublicNotification(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      fileContentType: this.editForm.get(['fileContentType'])!.value,
      file: this.editForm.get(['file'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
