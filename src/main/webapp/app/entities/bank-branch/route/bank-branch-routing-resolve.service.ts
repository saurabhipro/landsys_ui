import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBankBranch, BankBranch } from '../bank-branch.model';
import { BankBranchService } from '../service/bank-branch.service';

@Injectable({ providedIn: 'root' })
export class BankBranchRoutingResolveService implements Resolve<IBankBranch> {
  constructor(protected service: BankBranchService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBankBranch> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bankBranch: HttpResponse<BankBranch>) => {
          if (bankBranch.body) {
            return of(bankBranch.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BankBranch());
  }
}
