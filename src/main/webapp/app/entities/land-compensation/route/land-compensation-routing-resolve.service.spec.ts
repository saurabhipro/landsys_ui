import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ILandCompensation, LandCompensation } from '../land-compensation.model';
import { LandCompensationService } from '../service/land-compensation.service';

import { LandCompensationRoutingResolveService } from './land-compensation-routing-resolve.service';

describe('LandCompensation routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LandCompensationRoutingResolveService;
  let service: LandCompensationService;
  let resultLandCompensation: ILandCompensation | undefined;

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
    routingResolveService = TestBed.inject(LandCompensationRoutingResolveService);
    service = TestBed.inject(LandCompensationService);
    resultLandCompensation = undefined;
  });

  describe('resolve', () => {
    it('should return ILandCompensation returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLandCompensation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLandCompensation).toEqual({ id: 123 });
    });

    it('should return new ILandCompensation if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLandCompensation = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLandCompensation).toEqual(new LandCompensation());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as LandCompensation })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLandCompensation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLandCompensation).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
