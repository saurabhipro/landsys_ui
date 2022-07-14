import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICitizen, Citizen } from '../citizen.model';
import { CitizenService } from '../service/citizen.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IBankBranch } from 'app/entities/bank-branch/bank-branch.model';
import { BankBranchService } from 'app/entities/bank-branch/service/bank-branch.service';

@Component({
  selector: 'jhi-citizen-update',
  templateUrl: './citizen-update.component.html',
})
export class CitizenUpdateComponent implements OnInit {
  isSaving = false;

  bankBranchesSharedCollection: IBankBranch[] = [];

  editForm = this.fb.group({
    id: [],
    photo: [],
    photoContentType: [],
    name: [null, [Validators.required]],
    address: [null, [Validators.required]],
    mobileNo: [],
    dob: [],
    accountNumber: [],
    fatherName: [null, [Validators.required]],
    spouseName: [],
    successorName: [],
    aadhar: [null, [Validators.required]],
    pan: [null, []],
    aadharImage: [],
    aadharImageContentType: [],
    panImage: [],
    panImageContentType: [],
    accountNo: [null, []],
    accNoImage: [],
    accNoImageContentType: [],
    bankBranch: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected citizenService: CitizenService,
    protected bankBranchService: BankBranchService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ citizen }) => {
      this.updateForm(citizen);

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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const citizen = this.createFromForm();
    if (citizen.id !== undefined) {
      this.subscribeToSaveResponse(this.citizenService.update(citizen));
    } else {
      this.subscribeToSaveResponse(this.citizenService.create(citizen));
    }
  }

  trackBankBranchById(_index: number, item: IBankBranch): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICitizen>>): void {
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

  protected updateForm(citizen: ICitizen): void {
    this.editForm.patchValue({
      id: citizen.id,
      photo: citizen.photo,
      photoContentType: citizen.photoContentType,
      name: citizen.name,
      address: citizen.address,
      mobileNo: citizen.mobileNo,
      dob: citizen.dob,
      accountNumber: citizen.accountNumber,
      fatherName: citizen.fatherName,
      spouseName: citizen.spouseName,
      successorName: citizen.successorName,
      aadhar: citizen.aadhar,
      pan: citizen.pan,
      aadharImage: citizen.aadharImage,
      aadharImageContentType: citizen.aadharImageContentType,
      panImage: citizen.panImage,
      panImageContentType: citizen.panImageContentType,
      accountNo: citizen.accountNo,
      accNoImage: citizen.accNoImage,
      accNoImageContentType: citizen.accNoImageContentType,
      bankBranch: citizen.bankBranch,
    });

    this.bankBranchesSharedCollection = this.bankBranchService.addBankBranchToCollectionIfMissing(
      this.bankBranchesSharedCollection,
      citizen.bankBranch
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bankBranchService
      .query()
      .pipe(map((res: HttpResponse<IBankBranch[]>) => res.body ?? []))
      .pipe(
        map((bankBranches: IBankBranch[]) =>
          this.bankBranchService.addBankBranchToCollectionIfMissing(bankBranches, this.editForm.get('bankBranch')!.value)
        )
      )
      .subscribe((bankBranches: IBankBranch[]) => (this.bankBranchesSharedCollection = bankBranches));
  }

  protected createFromForm(): ICitizen {
    return {
      ...new Citizen(),
      id: this.editForm.get(['id'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      name: this.editForm.get(['name'])!.value,
      address: this.editForm.get(['address'])!.value,
      mobileNo: this.editForm.get(['mobileNo'])!.value,
      dob: this.editForm.get(['dob'])!.value,
      accountNumber: this.editForm.get(['accountNumber'])!.value,
      fatherName: this.editForm.get(['fatherName'])!.value,
      spouseName: this.editForm.get(['spouseName'])!.value,
      successorName: this.editForm.get(['successorName'])!.value,
      aadhar: this.editForm.get(['aadhar'])!.value,
      pan: this.editForm.get(['pan'])!.value,
      aadharImageContentType: this.editForm.get(['aadharImageContentType'])!.value,
      aadharImage: this.editForm.get(['aadharImage'])!.value,
      panImageContentType: this.editForm.get(['panImageContentType'])!.value,
      panImage: this.editForm.get(['panImage'])!.value,
      accountNo: this.editForm.get(['accountNo'])!.value,
      accNoImageContentType: this.editForm.get(['accNoImageContentType'])!.value,
      accNoImage: this.editForm.get(['accNoImage'])!.value,
      bankBranch: this.editForm.get(['bankBranch'])!.value,
    };
  }
}
