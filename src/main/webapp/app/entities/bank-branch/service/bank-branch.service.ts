import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBankBranch, getBankBranchIdentifier } from '../bank-branch.model';

export type EntityResponseType = HttpResponse<IBankBranch>;
export type EntityArrayResponseType = HttpResponse<IBankBranch[]>;

@Injectable({ providedIn: 'root' })
export class BankBranchService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bank-branches');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bankBranch: IBankBranch): Observable<EntityResponseType> {
    return this.http.post<IBankBranch>(this.resourceUrl, bankBranch, { observe: 'response' });
  }

  update(bankBranch: IBankBranch): Observable<EntityResponseType> {
    return this.http.put<IBankBranch>(`${this.resourceUrl}/${getBankBranchIdentifier(bankBranch) as number}`, bankBranch, {
      observe: 'response',
    });
  }

  partialUpdate(bankBranch: IBankBranch): Observable<EntityResponseType> {
    return this.http.patch<IBankBranch>(`${this.resourceUrl}/${getBankBranchIdentifier(bankBranch) as number}`, bankBranch, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBankBranch>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBankBranch[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBankBranchToCollectionIfMissing(
    bankBranchCollection: IBankBranch[],
    ...bankBranchesToCheck: (IBankBranch | null | undefined)[]
  ): IBankBranch[] {
    const bankBranches: IBankBranch[] = bankBranchesToCheck.filter(isPresent);
    if (bankBranches.length > 0) {
      const bankBranchCollectionIdentifiers = bankBranchCollection.map(bankBranchItem => getBankBranchIdentifier(bankBranchItem)!);
      const bankBranchesToAdd = bankBranches.filter(bankBranchItem => {
        const bankBranchIdentifier = getBankBranchIdentifier(bankBranchItem);
        if (bankBranchIdentifier == null || bankBranchCollectionIdentifiers.includes(bankBranchIdentifier)) {
          return false;
        }
        bankBranchCollectionIdentifiers.push(bankBranchIdentifier);
        return true;
      });
      return [...bankBranchesToAdd, ...bankBranchCollection];
    }
    return bankBranchCollection;
  }
}
