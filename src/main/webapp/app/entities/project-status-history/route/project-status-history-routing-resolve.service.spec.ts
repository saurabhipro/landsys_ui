import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IProjectStatusHistory, ProjectStatusHistory } from '../project-status-history.model';
import { ProjectStatusHistoryService } from '../service/project-status-history.service';

import { ProjectStatusHistoryRoutingResolveService } from './project-status-history-routing-resolve.service';

describe('ProjectStatusHistory routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ProjectStatusHistoryRoutingResolveService;
  let service: ProjectStatusHistoryService;
  let resultProjectStatusHistory: IProjectStatusHistory | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ProjectStatusHistoryRoutingResolveService);
    service = TestBed.inject(ProjectStatusHistoryService);
    resultProjectStatusHistory = undefined;
  });

  describe('resolve', () => {
    it('should return IProjectStatusHistory returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProjectStatusHistory = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProjectStatusHistory).toEqual({ id: 123 });
    });

    it('should return new IProjectStatusHistory if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProjectStatusHistory = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultProjectStatusHistory).toEqual(new ProjectStatusHistory());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ProjectStatusHistory })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProjectStatusHistory = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProjectStatusHistory).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
