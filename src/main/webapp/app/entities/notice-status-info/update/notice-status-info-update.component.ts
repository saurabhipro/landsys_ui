import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { INoticeStatusInfo, NoticeStatusInfo } from '../notice-status-info.model';
import { NoticeStatusInfoService } from '../service/notice-status-info.service';
import { NoticeStatus } from 'app/entities/enumerations/notice-status.model';

@Component({
  selector: 'jhi-notice-status-info-update',
  templateUrl: './notice-status-info-update.component.html',
})
export class NoticeStatusInfoUpdateComponent implements OnInit {
  isSaving = false;
  noticeStatusValues = Object.keys(NoticeStatus);

  editForm = this.fb.group({
    id: [],
    status: [],
  });

  constructor(
    protected noticeStatusInfoService: NoticeStatusInfoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ noticeStatusInfo }) => {
      this.updateForm(noticeStatusInfo);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const noticeStatusInfo = this.createFromForm();
    if (noticeStatusInfo.id !== undefined) {
      this.subscribeToSaveResponse(this.noticeStatusInfoService.update(noticeStatusInfo));
    } else {
      this.subscribeToSaveResponse(this.noticeStatusInfoService.create(noticeStatusInfo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INoticeStatusInfo>>): void {
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

  protected updateForm(noticeStatusInfo: INoticeStatusInfo): void {
    this.editForm.patchValue({
      id: noticeStatusInfo.id,
      status: noticeStatusInfo.status,
    });
  }

  protected createFromForm(): INoticeStatusInfo {
    return {
      ...new NoticeStatusInfo(),
      id: this.editForm.get(['id'])!.value,
      status: this.editForm.get(['status'])!.value,
    };
  }
}
