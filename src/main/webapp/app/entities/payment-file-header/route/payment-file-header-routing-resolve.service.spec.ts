import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPaymentFileHeader, PaymentFileHeader } from '../payment-file-header.model';
import { PaymentFileHeaderService } from '../service/payment-file-header.service';

import { PaymentFileHeaderRoutingResolveService } from './payment-file-header-routing-resolve.service';

describe('PaymentFileHeader routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PaymentFileHeaderRoutingResolveService;
  let service: PaymentFileHeaderService;
  let resultPaymentFileHeader: IPaymentFileHeader | undefined;

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
    routingResolveService = TestBed.inject(PaymentFileHeaderRoutingResolveService);
    service = TestBed.inject(PaymentFileHeaderService);
    resultPaymentFileHeader = undefined;
  });

  describe('resolve', () => {
    it('should return IPaymentFileHeader returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentFileHeader = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPaymentFileHeader).toEqual({ id: 123 });
    });

    it('should return new IPaymentFileHeader if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentFileHeader = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPaymentFileHeader).toEqual(new PaymentFileHeader());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PaymentFileHeader })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentFileHeader = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPaymentFileHeader).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
