import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ICreatePaymentFile, CreatePaymentFile } from '../create-payment-file.model';
import { CreatePaymentFileService } from '../service/create-payment-file.service';

import { CreatePaymentFileRoutingResolveService } from './create-payment-file-routing-resolve.service';

describe('CreatePaymentFile routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CreatePaymentFileRoutingResolveService;
  let service: CreatePaymentFileService;
  let resultCreatePaymentFile: ICreatePaymentFile | undefined;

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
    routingResolveService = TestBed.inject(CreatePaymentFileRoutingResolveService);
    service = TestBed.inject(CreatePaymentFileService);
    resultCreatePaymentFile = undefined;
  });

  describe('resolve', () => {
    it('should return ICreatePaymentFile returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCreatePaymentFile = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCreatePaymentFile).toEqual({ id: 123 });
    });

    it('should return new ICreatePaymentFile if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCreatePaymentFile = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCreatePaymentFile).toEqual(new CreatePaymentFile());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CreatePaymentFile })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCreatePaymentFile = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCreatePaymentFile).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
