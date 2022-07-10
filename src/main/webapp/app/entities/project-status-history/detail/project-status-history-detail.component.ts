import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProjectStatusHistory } from '../project-status-history.model';

@Component({
  selector: 'jhi-project-status-history-detail',
  templateUrl: './project-status-history-detail.component.html',
})
export class ProjectStatusHistoryDetailComponent implements OnInit {
  projectStatusHistory: IProjectStatusHistory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectStatusHistory }) => {
      this.projectStatusHistory = projectStatusHistory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
