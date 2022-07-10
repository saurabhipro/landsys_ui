import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILand, Land } from '../land.model';
import { LandService } from '../service/land.service';

@Injectable({ providedIn: 'root' })
export class LandRoutingResolveService implements Resolve<ILand> {
  constructor(protected service: LandService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILand> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((land: HttpResponse<Land>) => {
          if (land.body) {
            return of(land.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Land());
  }
}
