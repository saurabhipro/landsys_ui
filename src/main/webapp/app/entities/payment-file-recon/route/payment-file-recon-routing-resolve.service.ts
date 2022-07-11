import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPaymentFileRecon, PaymentFileRecon } from '../payment-file-recon.model';
import { PaymentFileReconService } from '../service/payment-file-recon.service';

@Injectable({ providedIn: 'root' })
export class PaymentFileReconRoutingResolveService implements Resolve<IPaymentFileRecon> {
  constructor(protected service: PaymentFileReconService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentFileRecon> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentFileRecon: HttpResponse<PaymentFileRecon>) => {
          if (paymentFileRecon.body) {
            return of(paymentFileRecon.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PaymentFileRecon());
  }
}
