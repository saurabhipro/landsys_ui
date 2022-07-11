import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPaymentFile, getPaymentFileIdentifier } from '../payment-file.model';

export type EntityResponseType = HttpResponse<IPaymentFile>;
export type EntityArrayResponseType = HttpResponse<IPaymentFile[]>;

@Injectable({ providedIn: 'root' })
export class PaymentFileService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payment-files');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paymentFile: IPaymentFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentFile);
    return this.http
      .post<IPaymentFile>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paymentFile: IPaymentFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentFile);
    return this.http
      .put<IPaymentFile>(`${this.resourceUrl}/${getPaymentFileIdentifier(paymentFile) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(paymentFile: IPaymentFile): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paymentFile);
    return this.http
      .patch<IPaymentFile>(`${this.resourceUrl}/${getPaymentFileIdentifier(paymentFile) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPaymentFile>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPaymentFile[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPaymentFileToCollectionIfMissing(
    paymentFileCollection: IPaymentFile[],
    ...paymentFilesToCheck: (IPaymentFile | null | undefined)[]
  ): IPaymentFile[] {
    const paymentFiles: IPaymentFile[] = paymentFilesToCheck.filter(isPresent);
    if (paymentFiles.length > 0) {
      const paymentFileCollectionIdentifiers = paymentFileCollection.map(paymentFileItem => getPaymentFileIdentifier(paymentFileItem)!);
      const paymentFilesToAdd = paymentFiles.filter(paymentFileItem => {
        const paymentFileIdentifier = getPaymentFileIdentifier(paymentFileItem);
        if (paymentFileIdentifier == null || paymentFileCollectionIdentifiers.includes(paymentFileIdentifier)) {
          return false;
        }
        paymentFileCollectionIdentifiers.push(paymentFileIdentifier);
        return true;
      });
      return [...paymentFilesToAdd, ...paymentFileCollection];
    }
    return paymentFileCollection;
  }

  protected convertDateFromClient(paymentFile: IPaymentFile): IPaymentFile {
    return Object.assign({}, paymentFile, {
      paymentFileDate: paymentFile.paymentFileDate?.isValid() ? paymentFile.paymentFileDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.paymentFileDate = res.body.paymentFileDate ? dayjs(res.body.paymentFileDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((paymentFile: IPaymentFile) => {
        paymentFile.paymentFileDate = paymentFile.paymentFileDate ? dayjs(paymentFile.paymentFileDate) : undefined;
      });
    }
    return res;
  }
}
