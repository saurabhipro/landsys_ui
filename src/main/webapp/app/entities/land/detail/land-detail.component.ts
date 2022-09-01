import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { IProject } from 'app/entities/project/project.model';

import { ILand } from '../land.model';
import { TransactionHistory } from 'app/entities/transaction-history/transaction-history.model';

@Component({
  selector: 'jhi-land-detail',
  templateUrl: './land-detail.component.html',
})
export class LandDetailComponent implements OnInit {
  land: ILand | null = null;

  selectedProject: IProject | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.selectedProject = this.sessionStorageService.retrieve('ContextProject');
    this.activatedRoute.data.subscribe(({ land }) => {
      this.land = land;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
