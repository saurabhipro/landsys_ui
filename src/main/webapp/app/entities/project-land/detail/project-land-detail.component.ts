import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProjectLand } from '../project-land.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-project-land-detail',
  templateUrl: './project-land-detail.component.html',
})
export class ProjectLandDetailComponent implements OnInit {
  projectLand: IProjectLand | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectLand }) => {
      this.projectLand = projectLand;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
