import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILandCompensation, LandCompensation } from '../land-compensation.model';
import { LandCompensationService } from '../service/land-compensation.service';

@Injectable({ providedIn: 'root' })
export class LandCompensationRoutingResolveService implements Resolve<ILandCompensation> {
  constructor(protected service: LandCompensationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILandCompensation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((landCompensation: HttpResponse<LandCompensation>) => {
          if (landCompensation.body) {
            return of(landCompensation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LandCompensation());
  }
}
