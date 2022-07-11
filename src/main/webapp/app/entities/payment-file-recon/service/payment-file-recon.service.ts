import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPaymentFileRecon, getPaymentFileReconIdentifier } from '../payment-file-recon.model';

export type EntityResponseType = HttpResponse<IPaymentFileRecon>;
export type EntityArrayResponseType = HttpResponse<IPaymentFileRecon[]>;

@Injectable({ providedIn: 'root' })
export class PaymentFileReconService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payment-file-recons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paymentFileRecon: IPaymentFileRecon): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentFileRecon);
    return this.http
      .post<IPaymentFileRecon>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paymentFileRecon: IPaymentFileRecon): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentFileRecon);
    return this.http
      .put<IPaymentFileRecon>(`${this.resourceUrl}/${getPaymentFileReconIdentifier(paymentFileRecon) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(paymentFileRecon: IPaymentFileRecon): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentFileRecon);
    return this.http
      .patch<IPaymentFileRecon>(`${this.resourceUrl}/${getPaymentFileReconIdentifier(paymentFileRecon) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPaymentFileRecon>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPaymentFileRecon[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPaymentFileReconToCollectionIfMissing(
    paymentFileReconCollection: IPaymentFileRecon[],
    ...paymentFileReconsToCheck: (IPaymentFileRecon | null | undefined)[]
  ): IPaymentFileRecon[] {
    const paymentFileRecons: IPaymentFileRecon[] = paymentFileReconsToCheck.filter(isPresent);
    if (paymentFileRecons.length > 0) {
      const paymentFileReconCollectionIdentifiers = paymentFileReconCollection.map(
        paymentFileReconItem => getPaymentFileReconIdentifier(paymentFileReconItem)!
      );
      const paymentFileReconsToAdd = paymentFileRecons.filter(paymentFileReconItem => {
        const paymentFileReconIdentifier = getPaymentFileReconIdentifier(paymentFileReconItem);
        if (paymentFileReconIdentifier == null || paymentFileReconCollectionIdentifiers.includes(paymentFileReconIdentifier)) {
          return false;
        }
        paymentFileReconCollectionIdentifiers.push(paymentFileReconIdentifier);
        return true;
      });
      return [...paymentFileReconsToAdd, ...paymentFileReconCollection];
    }
    return paymentFileReconCollection;
  }

  protected convertDateFromClient(paymentFileRecon: IPaymentFileRecon): IPaymentFileRecon {
    return Object.assign({}, paymentFileRecon, {
      paymentDate: paymentFileRecon.paymentDate?.isValid() ? paymentFileRecon.paymentDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.paymentDate = res.body.paymentDate ? dayjs(res.body.paymentDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((paymentFileRecon: IPaymentFileRecon) => {
        paymentFileRecon.paymentDate = paymentFileRecon.paymentDate ? dayjs(paymentFileRecon.paymentDate) : undefined;
      });
    }
    return res;
  }
}
