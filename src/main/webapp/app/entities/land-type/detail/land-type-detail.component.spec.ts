import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LandTypeDetailComponent } from './land-type-detail.component';

describe('LandType Management Detail Component', () => {
  let comp: LandTypeDetailComponent;
  let fixture: ComponentFixture<LandTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ landType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LandTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LandTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load landType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.landType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
