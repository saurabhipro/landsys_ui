import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPaymentFileRecon, PaymentFileRecon } from '../payment-file-recon.model';
import { PaymentFileReconService } from '../service/payment-file-recon.service';

import { PaymentFileReconRoutingResolveService } from './payment-file-recon-routing-resolve.service';

describe('PaymentFileRecon routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PaymentFileReconRoutingResolveService;
  let service: PaymentFileReconService;
  let resultPaymentFileRecon: IPaymentFileRecon | undefined;

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
    routingResolveService = TestBed.inject(PaymentFileReconRoutingResolveService);
    service = TestBed.inject(PaymentFileReconService);
    resultPaymentFileRecon = undefined;
  });

  describe('resolve', () => {
    it('should return IPaymentFileRecon returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentFileRecon = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPaymentFileRecon).toEqual({ id: 123 });
    });

    it('should return new IPaymentFileRecon if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentFileRecon = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPaymentFileRecon).toEqual(new PaymentFileRecon());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PaymentFileRecon })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPaymentFileRecon = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPaymentFileRecon).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
