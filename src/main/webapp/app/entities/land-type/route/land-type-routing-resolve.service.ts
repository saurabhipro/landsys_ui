import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILandType, LandType } from '../land-type.model';
import { LandTypeService } from '../service/land-type.service';

@Injectable({ providedIn: 'root' })
export class LandTypeRoutingResolveService implements Resolve<ILandType> {
  constructor(protected service: LandTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILandType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((landType: HttpResponse<LandType>) => {
          if (landType.body) {
            return of(landType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LandType());
  }
}
