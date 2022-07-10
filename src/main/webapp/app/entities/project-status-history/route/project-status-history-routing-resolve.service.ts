import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProjectStatusHistory, ProjectStatusHistory } from '../project-status-history.model';
import { ProjectStatusHistoryService } from '../service/project-status-history.service';

@Injectable({ providedIn: 'root' })
export class ProjectStatusHistoryRoutingResolveService implements Resolve<IProjectStatusHistory> {
  constructor(protected service: ProjectStatusHistoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProjectStatusHistory> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((projectStatusHistory: HttpResponse<ProjectStatusHistory>) => {
          if (projectStatusHistory.body) {
            return of(projectStatusHistory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProjectStatusHistory());
  }
}
