import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPaymentFileHeader, getPaymentFileHeaderIdentifier } from '../payment-file-header.model';

export type EntityResponseType = HttpResponse<IPaymentFileHeader>;
export type EntityArrayResponseType = HttpResponse<IPaymentFileHeader[]>;

@Injectable({ providedIn: 'root' })
export class PaymentFileHeaderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payment-file-headers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paymentFileHeader: IPaymentFileHeader): Observable<EntityResponseType> {
    return this.http.post<IPaymentFileHeader>(this.resourceUrl, paymentFileHeader, { observe: 'response' });
  }

  update(paymentFileHeader: IPaymentFileHeader): Observable<EntityResponseType> {
    return this.http.put<IPaymentFileHeader>(
      `${this.resourceUrl}/${getPaymentFileHeaderIdentifier(paymentFileHeader) as number}`,
      paymentFileHeader,
      { observe: 'response' }
    );
  }

  partialUpdate(paymentFileHeader: IPaymentFileHeader): Observable<EntityResponseType> {
    return this.http.patch<IPaymentFileHeader>(
      `${this.resourceUrl}/${getPaymentFileHeaderIdentifier(paymentFileHeader) as number}`,
      paymentFileHeader,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPaymentFileHeader>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPaymentFileHeader[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPaymentFileHeaderToCollectionIfMissing(
    paymentFileHeaderCollection: IPaymentFileHeader[],
    ...paymentFileHeadersToCheck: (IPaymentFileHeader | null | undefined)[]
  ): IPaymentFileHeader[] {
    const paymentFileHeaders: IPaymentFileHeader[] = paymentFileHeadersToCheck.filter(isPresent);
    if (paymentFileHeaders.length > 0) {
      const paymentFileHeaderCollectionIdentifiers = paymentFileHeaderCollection.map(
        paymentFileHeaderItem => getPaymentFileHeaderIdentifier(paymentFileHeaderItem)!
      );
      const paymentFileHeadersToAdd = paymentFileHeaders.filter(paymentFileHeaderItem => {
        const paymentFileHeaderIdentifier = getPaymentFileHeaderIdentifier(paymentFileHeaderItem);
        if (paymentFileHeaderIdentifier == null || paymentFileHeaderCollectionIdentifiers.includes(paymentFileHeaderIdentifier)) {
          return false;
        }
        paymentFileHeaderCollectionIdentifiers.push(paymentFileHeaderIdentifier);
        return true;
      });
      return [...paymentFileHeadersToAdd, ...paymentFileHeaderCollection];
    }
    return paymentFileHeaderCollection;
  }
}
