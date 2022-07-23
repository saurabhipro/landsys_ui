import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjectLand, getProjectLandIdentifier } from '../project-land.model';
import { ISurvey } from '../../survey/survey.model';

export type EntityResponseType = HttpResponse<IProjectLand>;
export type EntityArrayResponseType = HttpResponse<IProjectLand[]>;

@Injectable({ providedIn: 'root' })
export class ProjectLandService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/project-lands');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(projectLand: IProjectLand): Observable<EntityResponseType> {
    return this.http.post<IProjectLand>(this.resourceUrl, projectLand, { observe: 'response' });
  }

  update(projectLand: IProjectLand): Observable<EntityResponseType> {
    return this.http.put<IProjectLand>(`${this.resourceUrl}/${getProjectLandIdentifier(projectLand) as number}`, projectLand, {
      observe: 'response',
    });
  }

  partialUpdate(projectLand: IProjectLand): Observable<EntityResponseType> {
    return this.http.patch<IProjectLand>(`${this.resourceUrl}/${getProjectLandIdentifier(projectLand) as number}`, projectLand, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProjectLand>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProjectLand[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProjectLandToCollectionIfMissing(
    projectLandCollection: IProjectLand[],
    ...projectLandsToCheck: (IProjectLand | null | undefined)[]
  ): IProjectLand[] {
    const projectLands: IProjectLand[] = projectLandsToCheck.filter(isPresent);
    if (projectLands.length > 0) {
      const projectLandCollectionIdentifiers = projectLandCollection.map(projectLandItem => getProjectLandIdentifier(projectLandItem)!);
      const projectLandsToAdd = projectLands.filter(projectLandItem => {
        const projectLandIdentifier = getProjectLandIdentifier(projectLandItem);
        if (projectLandIdentifier == null || projectLandCollectionIdentifiers.includes(projectLandIdentifier)) {
          return false;
        }
        projectLandCollectionIdentifiers.push(projectLandIdentifier);
        return true;
      });
      return [...projectLandsToAdd, ...projectLandCollection];
    }
    return projectLandCollection;
  }

  getSurvey(id: number): Observable<EntityResponseType> {
    return this.http.get<ISurvey>(`api/surveys/byProjectLand?id=${id}`, { observe: 'response' });
  }
}
