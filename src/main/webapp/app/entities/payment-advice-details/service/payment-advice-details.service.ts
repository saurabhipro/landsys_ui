import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPaymentAdviceDetails, getPaymentAdviceDetailsIdentifier } from '../payment-advice-details.model';

export type EntityResponseType = HttpResponse<IPaymentAdviceDetails>;
export type EntityArrayResponseType = HttpResponse<IPaymentAdviceDetails[]>;

@Injectable({ providedIn: 'root' })
export class PaymentAdviceDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payment-advice-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paymentAdviceDetails: IPaymentAdviceDetails): Observable<EntityResponseType> {
    return this.http.post<IPaymentAdviceDetails>(this.resourceUrl, paymentAdviceDetails, { observe: 'response' });
  }

  update(paymentAdviceDetails: IPaymentAdviceDetails): Observable<EntityResponseType> {
    return this.http.put<IPaymentAdviceDetails>(
      `${this.resourceUrl}/${getPaymentAdviceDetailsIdentifier(paymentAdviceDetails) as number}`,
      paymentAdviceDetails,
      { observe: 'response' }
    );
  }

  partialUpdate(paymentAdviceDetails: IPaymentAdviceDetails): Observable<EntityResponseType> {
    return this.http.patch<IPaymentAdviceDetails>(
      `${this.resourceUrl}/${getPaymentAdviceDetailsIdentifier(paymentAdviceDetails) as number}`,
      paymentAdviceDetails,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPaymentAdviceDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPaymentAdviceDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPaymentAdviceDetailsToCollectionIfMissing(
    paymentAdviceDetailsCollection: IPaymentAdviceDetails[],
    ...paymentAdviceDetailsToCheck: (IPaymentAdviceDetails | null | undefined)[]
  ): IPaymentAdviceDetails[] {
    const paymentAdviceDetails: IPaymentAdviceDetails[] = paymentAdviceDetailsToCheck.filter(isPresent);
    if (paymentAdviceDetails.length > 0) {
      const paymentAdviceDetailsCollectionIdentifiers = paymentAdviceDetailsCollection.map(
        paymentAdviceDetailsItem => getPaymentAdviceDetailsIdentifier(paymentAdviceDetailsItem)!
      );
      const paymentAdviceDetailsToAdd = paymentAdviceDetails.filter(paymentAdviceDetailsItem => {
        const paymentAdviceDetailsIdentifier = getPaymentAdviceDetailsIdentifier(paymentAdviceDetailsItem);
        if (paymentAdviceDetailsIdentifier == null || paymentAdviceDetailsCollectionIdentifiers.includes(paymentAdviceDetailsIdentifier)) {
          return false;
        }
        paymentAdviceDetailsCollectionIdentifiers.push(paymentAdviceDetailsIdentifier);
        return true;
      });
      return [...paymentAdviceDetailsToAdd, ...paymentAdviceDetailsCollection];
    }
    return paymentAdviceDetailsCollection;
  }
}
