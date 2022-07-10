import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILand } from '../land.model';

@Component({
  selector: 'jhi-land-detail',
  templateUrl: './land-detail.component.html',
})
export class LandDetailComponent implements OnInit {
  land: ILand | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ land }) => {
      this.land = land;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
