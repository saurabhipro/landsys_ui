import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { INoticeStatus, NoticeStatus } from '../notice-status.model';
import { NoticeStatusService } from '../service/notice-status.service';

@Component({
  selector: 'jhi-notice-status-update',
  templateUrl: './notice-status-update.component.html',
})
export class NoticeStatusUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    status: [],
  });

  constructor(protected noticeStatusService: NoticeStatusService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ noticeStatus }) => {
      this.updateForm(noticeStatus);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const noticeStatus = this.createFromForm();
    if (noticeStatus.id !== undefined) {
      this.subscribeToSaveResponse(this.noticeStatusService.update(noticeStatus));
    } else {
      this.subscribeToSaveResponse(this.noticeStatusService.create(noticeStatus));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INoticeStatus>>): void {
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

  protected updateForm(noticeStatus: INoticeStatus): void {
    this.editForm.patchValue({
      id: noticeStatus.id,
      status: noticeStatus.status,
    });
  }

  protected createFromForm(): INoticeStatus {
    return {
      ...new NoticeStatus(),
      id: this.editForm.get(['id'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }
}
