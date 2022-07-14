import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKhatedar, Khatedar } from '../khatedar.model';
import { KhatedarService } from '../service/khatedar.service';

@Injectable({ providedIn: 'root' })
export class KhatedarRoutingResolveService implements Resolve<IKhatedar> {
  constructor(protected service: KhatedarService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKhatedar> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((khatedar: HttpResponse<Khatedar>) => {
          if (khatedar.body) {
            return of(khatedar.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Khatedar());
  }
}
