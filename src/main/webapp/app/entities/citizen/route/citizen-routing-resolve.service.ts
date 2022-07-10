import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICitizen, Citizen } from '../citizen.model';
import { CitizenService } from '../service/citizen.service';

@Injectable({ providedIn: 'root' })
export class CitizenRoutingResolveService implements Resolve<ICitizen> {
  constructor(protected service: CitizenService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICitizen> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((citizen: HttpResponse<Citizen>) => {
          if (citizen.body) {
            return of(citizen.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Citizen());
  }
}
