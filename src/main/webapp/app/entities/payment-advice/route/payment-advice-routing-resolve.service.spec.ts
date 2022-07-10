import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPaymentAdvice, PaymentAdvice } from '../payment-advice.model';
import { PaymentAdviceService } from '../service/payment-advice.service';

import { PaymentAdviceRoutingResolveService } from './payment-advice-routing-resolve.service';

describe('PaymentAdvice routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PaymentAdviceRoutingResolveService;
  let service: PaymentAdviceService;
  let resultPaymentAdvice: IPaymentAdvice | undefined;

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
    routingResolveService = TestBed.inject(PaymentAdviceRoutingResolveService);
    service = TestBed.inject(PaymentAdviceService);
    resultPaymentAdvice = undefined;
  });

  describe('resolve', () => {
    it('should return IPaymentAdvice returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentAdvice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPaymentAdvice).toEqual({ id: 123 });
    });

    it('should return new IPaymentAdvice if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentAdvice = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPaymentAdvice).toEqual(new PaymentAdvice());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PaymentAdvice })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentAdvice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPaymentAdvice).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
