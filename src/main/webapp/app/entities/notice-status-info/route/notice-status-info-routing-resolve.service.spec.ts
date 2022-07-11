import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { INoticeStatusInfo, NoticeStatusInfo } from '../notice-status-info.model';
import { NoticeStatusInfoService } from '../service/notice-status-info.service';

import { NoticeStatusInfoRoutingResolveService } from './notice-status-info-routing-resolve.service';

describe('NoticeStatusInfo routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: NoticeStatusInfoRoutingResolveService;
  let service: NoticeStatusInfoService;
  let resultNoticeStatusInfo: INoticeStatusInfo | undefined;

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
    routingResolveService = TestBed.inject(NoticeStatusInfoRoutingResolveService);
    service = TestBed.inject(NoticeStatusInfoService);
    resultNoticeStatusInfo = undefined;
  });

  describe('resolve', () => {
    it('should return INoticeStatusInfo returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNoticeStatusInfo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNoticeStatusInfo).toEqual({ id: 123 });
    });

    it('should return new INoticeStatusInfo if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNoticeStatusInfo = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultNoticeStatusInfo).toEqual(new NoticeStatusInfo());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as NoticeStatusInfo })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNoticeStatusInfo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNoticeStatusInfo).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
