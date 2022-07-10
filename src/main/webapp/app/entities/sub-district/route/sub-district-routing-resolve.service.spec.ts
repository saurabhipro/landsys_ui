import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISubDistrict, SubDistrict } from '../sub-district.model';
import { SubDistrictService } from '../service/sub-district.service';

import { SubDistrictRoutingResolveService } from './sub-district-routing-resolve.service';

describe('SubDistrict routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SubDistrictRoutingResolveService;
  let service: SubDistrictService;
  let resultSubDistrict: ISubDistrict | undefined;

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
    routingResolveService = TestBed.inject(SubDistrictRoutingResolveService);
    service = TestBed.inject(SubDistrictService);
    resultSubDistrict = undefined;
  });

  describe('resolve', () => {
    it('should return ISubDistrict returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSubDistrict = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSubDistrict).toEqual({ id: 123 });
    });

    it('should return new ISubDistrict if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSubDistrict = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSubDistrict).toEqual(new SubDistrict());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SubDistrict })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSubDistrict = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSubDistrict).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
