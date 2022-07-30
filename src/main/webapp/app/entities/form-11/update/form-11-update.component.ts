import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IForm11, Form11 } from '../form-11.model';
import { Form11Service } from '../service/form-11.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

@Component({
  selector: 'jhi-form-11-update',
  templateUrl: './form-11-update.component.html',
})
export class Form11UpdateComponent implements OnInit {

  // todo project
  isSaving = false;
  projectsSharedCollection: IProject[] = [];
  editForm = this.fb.group({
    id: [],
    projectName: [],
    district: [],
    subDistrict: [],
    village: [],
  });

  constructor(protected form11Service: Form11Service, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .subscribe((projects: IProject[]) => {
        this.projectsSharedCollection = projects});
  }


  trackProjectById(_index: number, item: IProject): number {
    return item.id!;
  }

  

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const form11 = this.createFromForm();
    if (form11.id !== undefined) {
      this.subscribeToSaveResponse(this.form11Service.update(form11));
    } else {
      this.subscribeToSaveResponse(this.form11Service.create(form11));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IForm11>>): void {
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

  protected updateForm(form11: IForm11): void {
    this.editForm.patchValue({
      id: form11.id,
      projectName: form11.projectName,
      district: form11.district,
      subDistrict: form11.subDistrict,
      village: form11.village,
    });
  }

  protected createFromForm(): IForm11 {
    return {
      ...new Form11(),
      id: this.editForm.get(['id'])!.value,
      projectName: this.editForm.get(['projectName'])!.value,
      district: this.editForm.get(['district'])!.value,
      subDistrict: this.editForm.get(['subDistrict'])!.value,
      village: this.editForm.get(['village'])!.value,
    };
  }
}
