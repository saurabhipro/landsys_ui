import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransactionHistory, getTransactionHistoryIdentifier } from '../transaction-history.model';

export type EntityResponseType = HttpResponse<ITransactionHistory>;
export type EntityArrayResponseType = HttpResponse<ITransactionHistory[]>;

@Injectable({ providedIn: 'root' })
export class TransactionHistoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/transaction-histories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(transactionHistory: ITransactionHistory): Observable<EntityResponseType> {
    return this.http.post<ITransactionHistory>(this.resourceUrl, transactionHistory, { observe: 'response' });
  }

  update(transactionHistory: ITransactionHistory): Observable<EntityResponseType> {
    return this.http.put<ITransactionHistory>(
      `${this.resourceUrl}/${getTransactionHistoryIdentifier(transactionHistory) as number}`,
      transactionHistory,
      { observe: 'response' }
    );
  }

  partialUpdate(transactionHistory: ITransactionHistory): Observable<EntityResponseType> {
    return this.http.patch<ITransactionHistory>(
      `${this.resourceUrl}/${getTransactionHistoryIdentifier(transactionHistory) as number}`,
      transactionHistory,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITransactionHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITransactionHistory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTransactionHistoryToCollectionIfMissing(
    transactionHistoryCollection: ITransactionHistory[],
    ...transactionHistoriesToCheck: (ITransactionHistory | null | undefined)[]
  ): ITransactionHistory[] {
    const transactionHistories: ITransactionHistory[] = transactionHistoriesToCheck.filter(isPresent);
    if (transactionHistories.length > 0) {
      const transactionHistoryCollectionIdentifiers = transactionHistoryCollection.map(
        transactionHistoryItem => getTransactionHistoryIdentifier(transactionHistoryItem)!
      );
      const transactionHistoriesToAdd = transactionHistories.filter(transactionHistoryItem => {
        const transactionHistoryIdentifier = getTransactionHistoryIdentifier(transactionHistoryItem);
        if (transactionHistoryIdentifier == null || transactionHistoryCollectionIdentifiers.includes(transactionHistoryIdentifier)) {
          return false;
        }
        transactionHistoryCollectionIdentifiers.push(transactionHistoryIdentifier);
        return true;
      });
      return [...transactionHistoriesToAdd, ...transactionHistoryCollection];
    }
    return transactionHistoryCollection;
  }
}
