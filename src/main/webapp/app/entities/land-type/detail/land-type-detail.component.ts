import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILandType } from '../land-type.model';

@Component({
  selector: 'jhi-land-type-detail',
  templateUrl: './land-type-detail.component.html',
})
export class LandTypeDetailComponent implements OnInit {
  landType: ILandType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ landType }) => {
      this.landType = landType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
