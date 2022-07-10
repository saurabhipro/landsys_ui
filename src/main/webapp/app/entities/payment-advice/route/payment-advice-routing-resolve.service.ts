import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPaymentAdvice, PaymentAdvice } from '../payment-advice.model';
import { PaymentAdviceService } from '../service/payment-advice.service';

@Injectable({ providedIn: 'root' })
export class PaymentAdviceRoutingResolveService implements Resolve<IPaymentAdvice> {
  constructor(protected service: PaymentAdviceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentAdvice> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentAdvice: HttpResponse<PaymentAdvice>) => {
          if (paymentAdvice.body) {
            return of(paymentAdvice.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PaymentAdvice());
  }
}
