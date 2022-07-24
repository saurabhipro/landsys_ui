import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPaymentAdvice, getPaymentAdviceIdentifier } from '../payment-advice.model';
import { ILandCompensation } from '../../land-compensation/land-compensation.model';

export type EntityResponseType = HttpResponse<IPaymentAdvice>;
export type EntityArrayResponseType = HttpResponse<IPaymentAdvice[]>;

@Injectable({ providedIn: 'root' })
export class PaymentAdviceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payment-advices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paymentAdvice: IPaymentAdvice): Observable<EntityResponseType> {
    return this.http.post<IPaymentAdvice>(this.resourceUrl, paymentAdvice, { observe: 'response' });
  }

  update(paymentAdvice: IPaymentAdvice): Observable<EntityResponseType> {
    return this.http.put<IPaymentAdvice>(`${this.resourceUrl}/${getPaymentAdviceIdentifier(paymentAdvice) as number}`, paymentAdvice, {
      observe: 'response',
    });
  }

  partialUpdate(paymentAdvice: IPaymentAdvice): Observable<EntityResponseType> {
    return this.http.patch<IPaymentAdvice>(`${this.resourceUrl}/${getPaymentAdviceIdentifier(paymentAdvice) as number}`, paymentAdvice, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPaymentAdvice>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPaymentAdvice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPaymentAdviceToCollectionIfMissing(
    paymentAdviceCollection: IPaymentAdvice[],
    ...paymentAdvicesToCheck: (IPaymentAdvice | null | undefined)[]
  ): IPaymentAdvice[] {
    const paymentAdvices: IPaymentAdvice[] = paymentAdvicesToCheck.filter(isPresent);
    if (paymentAdvices.length > 0) {
      const paymentAdviceCollectionIdentifiers = paymentAdviceCollection.map(
        paymentAdviceItem => getPaymentAdviceIdentifier(paymentAdviceItem)!
      );
      const paymentAdvicesToAdd = paymentAdvices.filter(paymentAdviceItem => {
        const paymentAdviceIdentifier = getPaymentAdviceIdentifier(paymentAdviceItem);
        if (paymentAdviceIdentifier == null || paymentAdviceCollectionIdentifiers.includes(paymentAdviceIdentifier)) {
          return false;
        }
        paymentAdviceCollectionIdentifiers.push(paymentAdviceIdentifier);
        return true;
      });
      return [...paymentAdvicesToAdd, ...paymentAdviceCollection];
    }
    return paymentAdviceCollection;
  }

  getPaymentAdviceFromCompensation(id: number): Observable<HttpResponse<IPaymentAdvice>> {
    return this.http.get<IPaymentAdvice>(`/api/payment-advices?landCompensationId.equals=213`, { observe: 'response' });
  }
}
