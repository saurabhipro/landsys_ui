import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISubDistrict, SubDistrict } from '../sub-district.model';
import { SubDistrictService } from '../service/sub-district.service';

@Injectable({ providedIn: 'root' })
export class SubDistrictRoutingResolveService implements Resolve<ISubDistrict> {
  constructor(protected service: SubDistrictService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISubDistrict> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((subDistrict: HttpResponse<SubDistrict>) => {
          if (subDistrict.body) {
            return of(subDistrict.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SubDistrict());
  }
}
