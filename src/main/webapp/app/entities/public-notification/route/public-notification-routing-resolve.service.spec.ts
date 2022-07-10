import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPublicNotification, PublicNotification } from '../public-notification.model';
import { PublicNotificationService } from '../service/public-notification.service';

import { PublicNotificationRoutingResolveService } from './public-notification-routing-resolve.service';

describe('PublicNotification routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PublicNotificationRoutingResolveService;
  let service: PublicNotificationService;
  let resultPublicNotification: IPublicNotification | undefined;

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
    routingResolveService = TestBed.inject(PublicNotificationRoutingResolveService);
    service = TestBed.inject(PublicNotificationService);
    resultPublicNotification = undefined;
  });

  describe('resolve', () => {
    it('should return IPublicNotification returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPublicNotification = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPublicNotification).toEqual({ id: 123 });
    });

    it('should return new IPublicNotification if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPublicNotification = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPublicNotification).toEqual(new PublicNotification());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PublicNotification })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPublicNotification = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPublicNotification).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
