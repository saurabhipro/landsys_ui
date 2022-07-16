import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISequenceGenerator, getSequenceGeneratorIdentifier } from '../sequence-generator.model';

export type EntityResponseType = HttpResponse<ISequenceGenerator>;
export type EntityArrayResponseType = HttpResponse<ISequenceGenerator[]>;

@Injectable({ providedIn: 'root' })
export class SequenceGeneratorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sequence-generators');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sequenceGenerator: ISequenceGenerator): Observable<EntityResponseType> {
    return this.http.post<ISequenceGenerator>(this.resourceUrl, sequenceGenerator, { observe: 'response' });
  }

  update(sequenceGenerator: ISequenceGenerator): Observable<EntityResponseType> {
    return this.http.put<ISequenceGenerator>(
      `${this.resourceUrl}/${getSequenceGeneratorIdentifier(sequenceGenerator) as number}`,
      sequenceGenerator,
      { observe: 'response' }
    );
  }

  partialUpdate(sequenceGenerator: ISequenceGenerator): Observable<EntityResponseType> {
    return this.http.patch<ISequenceGenerator>(
      `${this.resourceUrl}/${getSequenceGeneratorIdentifier(sequenceGenerator) as number}`,
      sequenceGenerator,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISequenceGenerator>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISequenceGenerator[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSequenceGeneratorToCollectionIfMissing(
    sequenceGeneratorCollection: ISequenceGenerator[],
    ...sequenceGeneratorsToCheck: (ISequenceGenerator | null | undefined)[]
  ): ISequenceGenerator[] {
    const sequenceGenerators: ISequenceGenerator[] = sequenceGeneratorsToCheck.filter(isPresent);
    if (sequenceGenerators.length > 0) {
      const sequenceGeneratorCollectionIdentifiers = sequenceGeneratorCollection.map(
        sequenceGeneratorItem => getSequenceGeneratorIdentifier(sequenceGeneratorItem)!
      );
      const sequenceGeneratorsToAdd = sequenceGenerators.filter(sequenceGeneratorItem => {
        const sequenceGeneratorIdentifier = getSequenceGeneratorIdentifier(sequenceGeneratorItem);
        if (sequenceGeneratorIdentifier == null || sequenceGeneratorCollectionIdentifiers.includes(sequenceGeneratorIdentifier)) {
          return false;
        }
        sequenceGeneratorCollectionIdentifiers.push(sequenceGeneratorIdentifier);
        return true;
      });
      return [...sequenceGeneratorsToAdd, ...sequenceGeneratorCollection];
    }
    return sequenceGeneratorCollection;
  }
}
