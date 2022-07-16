import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISequenceGen, getSequenceGenIdentifier } from '../sequence-gen.model';

export type EntityResponseType = HttpResponse<ISequenceGen>;
export type EntityArrayResponseType = HttpResponse<ISequenceGen[]>;

@Injectable({ providedIn: 'root' })
export class SequenceGenService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sequence-gens');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sequenceGen: ISequenceGen): Observable<EntityResponseType> {
    return this.http.post<ISequenceGen>(this.resourceUrl, sequenceGen, { observe: 'response' });
  }

  update(sequenceGen: ISequenceGen): Observable<EntityResponseType> {
    return this.http.put<ISequenceGen>(`${this.resourceUrl}/${getSequenceGenIdentifier(sequenceGen) as number}`, sequenceGen, {
      observe: 'response',
    });
  }

  partialUpdate(sequenceGen: ISequenceGen): Observable<EntityResponseType> {
    return this.http.patch<ISequenceGen>(`${this.resourceUrl}/${getSequenceGenIdentifier(sequenceGen) as number}`, sequenceGen, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISequenceGen>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISequenceGen[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSequenceGenToCollectionIfMissing(
    sequenceGenCollection: ISequenceGen[],
    ...sequenceGensToCheck: (ISequenceGen | null | undefined)[]
  ): ISequenceGen[] {
    const sequenceGens: ISequenceGen[] = sequenceGensToCheck.filter(isPresent);
    if (sequenceGens.length > 0) {
      const sequenceGenCollectionIdentifiers = sequenceGenCollection.map(sequenceGenItem => getSequenceGenIdentifier(sequenceGenItem)!);
      const sequenceGensToAdd = sequenceGens.filter(sequenceGenItem => {
        const sequenceGenIdentifier = getSequenceGenIdentifier(sequenceGenItem);
        if (sequenceGenIdentifier == null || sequenceGenCollectionIdentifiers.includes(sequenceGenIdentifier)) {
          return false;
        }
        sequenceGenCollectionIdentifiers.push(sequenceGenIdentifier);
        return true;
      });
      return [...sequenceGensToAdd, ...sequenceGenCollection];
    }
    return sequenceGenCollection;
  }
}
