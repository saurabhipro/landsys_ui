import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { INoticeStatus, NoticeStatus } from '../notice-status.model';
import { NoticeStatusService } from '../service/notice-status.service';

import { NoticeStatusRoutingResolveService } from './notice-status-routing-resolve.service';

describe('NoticeStatus routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: NoticeStatusRoutingResolveService;
  let service: NoticeStatusService;
  let resultNoticeStatus: INoticeStatus | undefined;

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
    routingResolveService = TestBed.inject(NoticeStatusRoutingResolveService);
    service = TestBed.inject(NoticeStatusService);
    resultNoticeStatus = undefined;
  });

  describe('resolve', () => {
    it('should return INoticeStatus returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNoticeStatus = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNoticeStatus).toEqual({ id: 123 });
    });

    it('should return new INoticeStatus if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNoticeStatus = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultNoticeStatus).toEqual(new NoticeStatus());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as NoticeStatus })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNoticeStatus = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNoticeStatus).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
