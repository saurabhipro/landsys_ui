import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IForm11 } from '../form-11.model';
import { Form11Service } from '../service/form-11.service';
import { Form11DeleteDialogComponent } from '../delete/form-11-delete-dialog.component';

@Component({
  selector: 'jhi-form-11',
  templateUrl: './form-11.component.html',
})
export class Form11Component implements OnInit {
  form11s?: IForm11[];
  isLoading = false;

  constructor(protected form11Service: Form11Service, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.form11Service.query().subscribe({
      next: (res: HttpResponse<IForm11[]>) => {
        this.isLoading = false;
        this.form11s = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IForm11): number {
    return item.id!;
  }

  delete(form11: IForm11): void {
    const modalRef = this.modalService.open(Form11DeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.form11 = form11;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
