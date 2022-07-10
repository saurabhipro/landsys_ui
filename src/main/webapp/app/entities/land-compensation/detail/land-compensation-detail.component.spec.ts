import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LandCompensationDetailComponent } from './land-compensation-detail.component';

describe('LandCompensation Management Detail Component', () => {
  let comp: LandCompensationDetailComponent;
  let fixture: ComponentFixture<LandCompensationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandCompensationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ landCompensation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LandCompensationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LandCompensationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load landCompensation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.landCompensation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
