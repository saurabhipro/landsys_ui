import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProjectLand, ProjectLand } from '../project-land.model';
import { ProjectLandService } from '../service/project-land.service';

@Injectable({ providedIn: 'root' })
export class ProjectLandRoutingResolveService implements Resolve<IProjectLand> {
  constructor(protected service: ProjectLandService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProjectLand> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((projectLand: HttpResponse<ProjectLand>) => {
          if (projectLand.body) {
            return of(projectLand.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProjectLand());
  }
}
