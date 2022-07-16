import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISequenceGen, SequenceGen } from '../sequence-gen.model';
import { SequenceGenService } from '../service/sequence-gen.service';

import { SequenceGenRoutingResolveService } from './sequence-gen-routing-resolve.service';

describe('SequenceGen routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SequenceGenRoutingResolveService;
  let service: SequenceGenService;
  let resultSequenceGen: ISequenceGen | undefined;

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
    routingResolveService = TestBed.inject(SequenceGenRoutingResolveService);
    service = TestBed.inject(SequenceGenService);
    resultSequenceGen = undefined;
  });

  describe('resolve', () => {
    it('should return ISequenceGen returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSequenceGen = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSequenceGen).toEqual({ id: 123 });
    });

    it('should return new ISequenceGen if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSequenceGen = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSequenceGen).toEqual(new SequenceGen());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SequenceGen })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSequenceGen = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSequenceGen).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
