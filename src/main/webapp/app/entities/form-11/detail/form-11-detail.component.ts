import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IForm11 } from '../form-11.model';

@Component({
  selector: 'jhi-form-11-detail',
  templateUrl: './form-11-detail.component.html',
})
export class Form11DetailComponent implements OnInit {
  form11: IForm11 | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ form11 }) => {
      this.form11 = form11;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
