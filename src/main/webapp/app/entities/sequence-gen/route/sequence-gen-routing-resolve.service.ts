import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISequenceGen, SequenceGen } from '../sequence-gen.model';
import { SequenceGenService } from '../service/sequence-gen.service';

@Injectable({ providedIn: 'root' })
export class SequenceGenRoutingResolveService implements Resolve<ISequenceGen> {
  constructor(protected service: SequenceGenService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISequenceGen> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sequenceGen: HttpResponse<SequenceGen>) => {
          if (sequenceGen.body) {
            return of(sequenceGen.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SequenceGen());
  }
}
