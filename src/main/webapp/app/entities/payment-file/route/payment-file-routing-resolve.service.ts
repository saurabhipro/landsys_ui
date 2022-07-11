import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPaymentFile, PaymentFile } from '../payment-file.model';
import { PaymentFileService } from '../service/payment-file.service';

@Injectable({ providedIn: 'root' })
export class PaymentFileRoutingResolveService implements Resolve<IPaymentFile> {
  constructor(protected service: PaymentFileService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentFile> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentFile: HttpResponse<PaymentFile>) => {
          if (paymentFile.body) {
            return of(paymentFile.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PaymentFile());
  }
}
