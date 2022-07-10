import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { INotificationTemplate, NotificationTemplate } from '../notification-template.model';
import { NotificationTemplateService } from '../service/notification-template.service';

import { NotificationTemplateRoutingResolveService } from './notification-template-routing-resolve.service';

describe('NotificationTemplate routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: NotificationTemplateRoutingResolveService;
  let service: NotificationTemplateService;
  let resultNotificationTemplate: INotificationTemplate | undefined;

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
    routingResolveService = TestBed.inject(NotificationTemplateRoutingResolveService);
    service = TestBed.inject(NotificationTemplateService);
    resultNotificationTemplate = undefined;
  });

  describe('resolve', () => {
    it('should return INotificationTemplate returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNotificationTemplate = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNotificationTemplate).toEqual({ id: 123 });
    });

    it('should return new INotificationTemplate if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNotificationTemplate = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultNotificationTemplate).toEqual(new NotificationTemplate());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as NotificationTemplate })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultNotificationTemplate = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultNotificationTemplate).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
