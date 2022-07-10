import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LandDetailComponent } from './land-detail.component';

describe('Land Management Detail Component', () => {
  let comp: LandDetailComponent;
  let fixture: ComponentFixture<LandDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ land: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LandDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LandDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load land on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.land).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
