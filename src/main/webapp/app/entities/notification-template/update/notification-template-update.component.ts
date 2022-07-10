import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { INotificationTemplate, NotificationTemplate } from '../notification-template.model';
import { NotificationTemplateService } from '../service/notification-template.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-notification-template-update',
  templateUrl: './notification-template-update.component.html',
})
export class NotificationTemplateUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    templateText: [],
    defaultUse: [],
    file: [],
    fileContentType: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected notificationTemplateService: NotificationTemplateService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notificationTemplate }) => {
      this.updateForm(notificationTemplate);
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
    const notificationTemplate = this.createFromForm();
    if (notificationTemplate.id !== undefined) {
      this.subscribeToSaveResponse(this.notificationTemplateService.update(notificationTemplate));
    } else {
      this.subscribeToSaveResponse(this.notificationTemplateService.create(notificationTemplate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INotificationTemplate>>): void {
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

  protected updateForm(notificationTemplate: INotificationTemplate): void {
    this.editForm.patchValue({
      id: notificationTemplate.id,
      name: notificationTemplate.name,
      templateText: notificationTemplate.templateText,
      defaultUse: notificationTemplate.defaultUse,
      file: notificationTemplate.file,
      fileContentType: notificationTemplate.fileContentType,
    });
  }

  protected createFromForm(): INotificationTemplate {
    return {
      ...new NotificationTemplate(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      templateText: this.editForm.get(['templateText'])!.value,
      defaultUse: this.editForm.get(['defaultUse'])!.value,
      fileContentType: this.editForm.get(['fileContentType'])!.value,
      file: this.editForm.get(['file'])!.value,
    };
  }
}
