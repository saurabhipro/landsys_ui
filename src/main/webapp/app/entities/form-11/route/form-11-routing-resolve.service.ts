import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IForm11, Form11 } from '../form-11.model';
import { Form11Service } from '../service/form-11.service';

@Injectable({ providedIn: 'root' })
export class Form11RoutingResolveService implements Resolve<IForm11> {
  constructor(protected service: Form11Service, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IForm11> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((form11: HttpResponse<Form11>) => {
          if (form11.body) {
            return of(form11.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Form11());
  }
}
