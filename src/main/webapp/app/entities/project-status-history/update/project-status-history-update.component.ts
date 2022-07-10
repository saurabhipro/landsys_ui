import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IProjectStatusHistory, ProjectStatusHistory } from '../project-status-history.model';
import { ProjectStatusHistoryService } from '../service/project-status-history.service';
import { ProjectStatus } from 'app/entities/enumerations/project-status.model';

@Component({
  selector: 'jhi-project-status-history-update',
  templateUrl: './project-status-history-update.component.html',
})
export class ProjectStatusHistoryUpdateComponent implements OnInit {
  isSaving = false;
  projectStatusValues = Object.keys(ProjectStatus);

  editForm = this.fb.group({
    id: [],
    status: [],
    when: [],
    remarks: [],
  });

  constructor(
    protected projectStatusHistoryService: ProjectStatusHistoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectStatusHistory }) => {
      if (projectStatusHistory.id === undefined) {
        const today = dayjs().startOf('day');
        projectStatusHistory.when = today;
      }

      this.updateForm(projectStatusHistory);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const projectStatusHistory = this.createFromForm();
    if (projectStatusHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.projectStatusHistoryService.update(projectStatusHistory));
    } else {
      this.subscribeToSaveResponse(this.projectStatusHistoryService.create(projectStatusHistory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProjectStatusHistory>>): void {
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

  protected updateForm(projectStatusHistory: IProjectStatusHistory): void {
    this.editForm.patchValue({
      id: projectStatusHistory.id,
      status: projectStatusHistory.status,
      when: projectStatusHistory.when ? projectStatusHistory.when.format(DATE_TIME_FORMAT) : null,
      remarks: projectStatusHistory.remarks,
    });
  }

  protected createFromForm(): IProjectStatusHistory {
    return {
      ...new ProjectStatusHistory(),
      id: this.editForm.get(['id'])!.value,
      status: this.editForm.get(['status'])!.value,
      when: this.editForm.get(['when'])!.value ? dayjs(this.editForm.get(['when'])!.value, DATE_TIME_FORMAT) : undefined,
      remarks: this.editForm.get(['remarks'])!.value,
    };
  }
}
