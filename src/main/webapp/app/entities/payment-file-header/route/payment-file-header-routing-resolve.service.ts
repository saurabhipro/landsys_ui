import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPaymentFileHeader, PaymentFileHeader } from '../payment-file-header.model';
import { PaymentFileHeaderService } from '../service/payment-file-header.service';

@Injectable({ providedIn: 'root' })
export class PaymentFileHeaderRoutingResolveService implements Resolve<IPaymentFileHeader> {
  constructor(protected service: PaymentFileHeaderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentFileHeader> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentFileHeader: HttpResponse<PaymentFileHeader>) => {
          if (paymentFileHeader.body) {
            return of(paymentFileHeader.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PaymentFileHeader());
  }
}
