import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPaymentAdviceDetails, PaymentAdviceDetails } from '../payment-advice-details.model';
import { PaymentAdviceDetailsService } from '../service/payment-advice-details.service';

import { PaymentAdviceDetailsRoutingResolveService } from './payment-advice-details-routing-resolve.service';

describe('PaymentAdviceDetails routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PaymentAdviceDetailsRoutingResolveService;
  let service: PaymentAdviceDetailsService;
  let resultPaymentAdviceDetails: IPaymentAdviceDetails | undefined;

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
    routingResolveService = TestBed.inject(PaymentAdviceDetailsRoutingResolveService);
    service = TestBed.inject(PaymentAdviceDetailsService);
    resultPaymentAdviceDetails = undefined;
  });

  describe('resolve', () => {
    it('should return IPaymentAdviceDetails returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentAdviceDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPaymentAdviceDetails).toEqual({ id: 123 });
    });

    it('should return new IPaymentAdviceDetails if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentAdviceDetails = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPaymentAdviceDetails).toEqual(new PaymentAdviceDetails());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PaymentAdviceDetails })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentAdviceDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPaymentAdviceDetails).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
