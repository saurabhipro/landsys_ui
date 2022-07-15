import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICreatePaymentFile, CreatePaymentFile } from '../create-payment-file.model';
import { CreatePaymentFileService } from '../service/create-payment-file.service';

@Injectable({ providedIn: 'root' })
export class CreatePaymentFileRoutingResolveService implements Resolve<ICreatePaymentFile> {
  constructor(protected service: CreatePaymentFileService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreatePaymentFile> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((createPaymentFile: HttpResponse<CreatePaymentFile>) => {
          if (createPaymentFile.body) {
            return of(createPaymentFile.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CreatePaymentFile());
  }
}
