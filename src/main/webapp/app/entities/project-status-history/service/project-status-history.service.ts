import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjectStatusHistory, getProjectStatusHistoryIdentifier } from '../project-status-history.model';

export type EntityResponseType = HttpResponse<IProjectStatusHistory>;
export type EntityArrayResponseType = HttpResponse<IProjectStatusHistory[]>;

@Injectable({ providedIn: 'root' })
export class ProjectStatusHistoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/project-status-histories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(projectStatusHistory: IProjectStatusHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectStatusHistory);
    return this.http
      .post<IProjectStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(projectStatusHistory: IProjectStatusHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectStatusHistory);
    return this.http
      .put<IProjectStatusHistory>(`${this.resourceUrl}/${getProjectStatusHistoryIdentifier(projectStatusHistory) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(projectStatusHistory: IProjectStatusHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectStatusHistory);
    return this.http
      .patch<IProjectStatusHistory>(`${this.resourceUrl}/${getProjectStatusHistoryIdentifier(projectStatusHistory) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProjectStatusHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProjectStatusHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProjectStatusHistoryToCollectionIfMissing(
    projectStatusHistoryCollection: IProjectStatusHistory[],
    ...projectStatusHistoriesToCheck: (IProjectStatusHistory | null | undefined)[]
  ): IProjectStatusHistory[] {
    const projectStatusHistories: IProjectStatusHistory[] = projectStatusHistoriesToCheck.filter(isPresent);
    if (projectStatusHistories.length > 0) {
      const projectStatusHistoryCollectionIdentifiers = projectStatusHistoryCollection.map(
        projectStatusHistoryItem => getProjectStatusHistoryIdentifier(projectStatusHistoryItem)!
      );
      const projectStatusHistoriesToAdd = projectStatusHistories.filter(projectStatusHistoryItem => {
        const projectStatusHistoryIdentifier = getProjectStatusHistoryIdentifier(projectStatusHistoryItem);
        if (projectStatusHistoryIdentifier == null || projectStatusHistoryCollectionIdentifiers.includes(projectStatusHistoryIdentifier)) {
          return false;
        }
        projectStatusHistoryCollectionIdentifiers.push(projectStatusHistoryIdentifier);
        return true;
      });
      return [...projectStatusHistoriesToAdd, ...projectStatusHistoryCollection];
    }
    return projectStatusHistoryCollection;
  }

  protected convertDateFromClient(projectStatusHistory: IProjectStatusHistory): IProjectStatusHistory {
    return Object.assign({}, projectStatusHistory, {
      when: projectStatusHistory.when?.isValid() ? projectStatusHistory.when.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.when = res.body.when ? dayjs(res.body.when) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((projectStatusHistory: IProjectStatusHistory) => {
        projectStatusHistory.when = projectStatusHistory.when ? dayjs(projectStatusHistory.when) : undefined;
      });
    }
    return res;
  }
}
