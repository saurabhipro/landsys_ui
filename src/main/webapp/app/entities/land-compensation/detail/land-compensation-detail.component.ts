import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILandCompensation } from '../land-compensation.model';

@Component({
  selector: 'jhi-land-compensation-detail',
  templateUrl: './land-compensation-detail.component.html',
})
export class LandCompensationDetailComponent implements OnInit {
  landCompensation: ILandCompensation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ landCompensation }) => {
      this.landCompensation = landCompensation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
