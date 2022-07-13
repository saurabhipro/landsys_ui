import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPaymentAdviceDetails, PaymentAdviceDetails } from '../payment-advice-details.model';
import { PaymentAdviceDetailsService } from '../service/payment-advice-details.service';

@Injectable({ providedIn: 'root' })
export class PaymentAdviceDetailsRoutingResolveService implements Resolve<IPaymentAdviceDetails> {
  constructor(protected service: PaymentAdviceDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentAdviceDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentAdviceDetails: HttpResponse<PaymentAdviceDetails>) => {
          if (paymentAdviceDetails.body) {
            return of(paymentAdviceDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PaymentAdviceDetails());
  }
}
