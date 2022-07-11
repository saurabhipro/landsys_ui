import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IKhatedar, Khatedar } from '../khatedar.model';
import { KhatedarService } from '../service/khatedar.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { CitizenService } from 'app/entities/citizen/service/citizen.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { INoticeStatusInfo } from 'app/entities/notice-status-info/notice-status-info.model';
import { NoticeStatusInfoService } from 'app/entities/notice-status-info/service/notice-status-info.service';
import { KhatedarStatus } from 'app/entities/enumerations/khatedar-status.model';

@Component({
  selector: 'jhi-khatedar-update',
  templateUrl: './khatedar-update.component.html',
})
export class KhatedarUpdateComponent implements OnInit {
  isSaving = false;
  khatedarStatusValues = Object.keys(KhatedarStatus);

  citizensSharedCollection: ICitizen[] = [];
  projectLandsSharedCollection: IProjectLand[] = [];
  noticeStatusInfosSharedCollection: INoticeStatusInfo[] = [];

  editForm = this.fb.group({
    id: [],
    caseFileNo: [],
    remarks: [],
    noticeFile: [],
    noticeFileContentType: [],
    status: [],
    citizen: [null, Validators.required],
    projectLand: [null, Validators.required],
    noticeStatusInfo: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected khatedarService: KhatedarService,
    protected citizenService: CitizenService,
    protected projectLandService: ProjectLandService,
    protected noticeStatusInfoService: NoticeStatusInfoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ khatedar }) => {
      this.updateForm(khatedar);

      this.loadRelationshipsOptions();
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
    const khatedar = this.createFromForm();
    if (khatedar.id !== undefined) {
      this.subscribeToSaveResponse(this.khatedarService.update(khatedar));
    } else {
      this.subscribeToSaveResponse(this.khatedarService.create(khatedar));
    }
  }

  trackCitizenById(_index: number, item: ICitizen): number {
    return item.id!;
  }

  trackProjectLandById(_index: number, item: IProjectLand): number {
    return item.id!;
  }

  trackNoticeStatusInfoById(_index: number, item: INoticeStatusInfo): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKhatedar>>): void {
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

  protected updateForm(khatedar: IKhatedar): void {
    this.editForm.patchValue({
      id: khatedar.id,
      caseFileNo: khatedar.caseFileNo,
      remarks: khatedar.remarks,
      noticeFile: khatedar.noticeFile,
      noticeFileContentType: khatedar.noticeFileContentType,
      status: khatedar.status,
      citizen: khatedar.citizen,
      projectLand: khatedar.projectLand,
      noticeStatusInfo: khatedar.noticeStatusInfo,
    });

    this.citizensSharedCollection = this.citizenService.addCitizenToCollectionIfMissing(this.citizensSharedCollection, khatedar.citizen);
    this.projectLandsSharedCollection = this.projectLandService.addProjectLandToCollectionIfMissing(
      this.projectLandsSharedCollection,
      khatedar.projectLand
    );
    this.noticeStatusInfosSharedCollection = this.noticeStatusInfoService.addNoticeStatusInfoToCollectionIfMissing(
      this.noticeStatusInfosSharedCollection,
      khatedar.noticeStatusInfo
    );
  }

  protected loadRelationshipsOptions(): void {
    this.citizenService
      .query()
      .pipe(map((res: HttpResponse<ICitizen[]>) => res.body ?? []))
      .pipe(
        map((citizens: ICitizen[]) => this.citizenService.addCitizenToCollectionIfMissing(citizens, this.editForm.get('citizen')!.value))
      )
      .subscribe((citizens: ICitizen[]) => (this.citizensSharedCollection = citizens));

    this.projectLandService
      .query()
      .pipe(map((res: HttpResponse<IProjectLand[]>) => res.body ?? []))
      .pipe(
        map((projectLands: IProjectLand[]) =>
          this.projectLandService.addProjectLandToCollectionIfMissing(projectLands, this.editForm.get('projectLand')!.value)
        )
      )
      .subscribe((projectLands: IProjectLand[]) => (this.projectLandsSharedCollection = projectLands));

    this.noticeStatusInfoService
      .query()
      .pipe(map((res: HttpResponse<INoticeStatusInfo[]>) => res.body ?? []))
      .pipe(
        map((noticeStatusInfos: INoticeStatusInfo[]) =>
          this.noticeStatusInfoService.addNoticeStatusInfoToCollectionIfMissing(
            noticeStatusInfos,
            this.editForm.get('noticeStatusInfo')!.value
          )
        )
      )
      .subscribe((noticeStatusInfos: INoticeStatusInfo[]) => (this.noticeStatusInfosSharedCollection = noticeStatusInfos));
  }

  protected createFromForm(): IKhatedar {
    return {
      ...new Khatedar(),
      id: this.editForm.get(['id'])!.value,
      caseFileNo: this.editForm.get(['caseFileNo'])!.value,
      remarks: this.editForm.get(['remarks'])!.value,
      noticeFileContentType: this.editForm.get(['noticeFileContentType'])!.value,
      noticeFile: this.editForm.get(['noticeFile'])!.value,
      status: this.editForm.get(['status'])!.value,
      citizen: this.editForm.get(['citizen'])!.value,
      projectLand: this.editForm.get(['projectLand'])!.value,
      noticeStatusInfo: this.editForm.get(['noticeStatusInfo'])!.value,
    };
  }
}
