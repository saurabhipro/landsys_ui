import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  protected resourceUrl = this.appConfigService.getEndpointFor('api/projectInfo');

  constructor(protected http: HttpClient, protected appConfigService: ApplicationConfigService) {}

  query(id: number, req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(`${this.resourceUrl}/projectId/${id}`, { params: options, observe: 'response' });
  }
}
