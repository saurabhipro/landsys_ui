import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICreatePaymentFile, getCreatePaymentFileIdentifier } from '../create-payment-file.model';

export type EntityResponseType = HttpResponse<ICreatePaymentFile>;
export type EntityArrayResponseType = HttpResponse<ICreatePaymentFile[]>;

@Injectable({ providedIn: 'root' })
export class CreatePaymentFileService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/create-payment-files');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(createPaymentFile: ICreatePaymentFile): Observable<EntityResponseType> {
    return this.http.post<ICreatePaymentFile>(this.resourceUrl, createPaymentFile, { observe: 'response' });
  }

  update(createPaymentFile: ICreatePaymentFile): Observable<EntityResponseType> {
    return this.http.put<ICreatePaymentFile>(
      `${this.resourceUrl}/${getCreatePaymentFileIdentifier(createPaymentFile) as number}`,
      createPaymentFile,
      { observe: 'response' }
    );
  }

  partialUpdate(createPaymentFile: ICreatePaymentFile): Observable<EntityResponseType> {
    return this.http.patch<ICreatePaymentFile>(
      `${this.resourceUrl}/${getCreatePaymentFileIdentifier(createPaymentFile) as number}`,
      createPaymentFile,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICreatePaymentFile>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICreatePaymentFile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCreatePaymentFileToCollectionIfMissing(
    createPaymentFileCollection: ICreatePaymentFile[],
    ...createPaymentFilesToCheck: (ICreatePaymentFile | null | undefined)[]
  ): ICreatePaymentFile[] {
    const createPaymentFiles: ICreatePaymentFile[] = createPaymentFilesToCheck.filter(isPresent);
    if (createPaymentFiles.length > 0) {
      const createPaymentFileCollectionIdentifiers = createPaymentFileCollection.map(
        createPaymentFileItem => getCreatePaymentFileIdentifier(createPaymentFileItem)!
      );
      const createPaymentFilesToAdd = createPaymentFiles.filter(createPaymentFileItem => {
        const createPaymentFileIdentifier = getCreatePaymentFileIdentifier(createPaymentFileItem);
        if (createPaymentFileIdentifier == null || createPaymentFileCollectionIdentifiers.includes(createPaymentFileIdentifier)) {
          return false;
        }
        createPaymentFileCollectionIdentifiers.push(createPaymentFileIdentifier);
        return true;
      });
      return [...createPaymentFilesToAdd, ...createPaymentFileCollection];
    }
    return createPaymentFileCollection;
  }
}
