import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SubDistrictDetailComponent } from './sub-district-detail.component';

describe('SubDistrict Management Detail Component', () => {
  let comp: SubDistrictDetailComponent;
  let fixture: ComponentFixture<SubDistrictDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubDistrictDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ subDistrict: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SubDistrictDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SubDistrictDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load subDistrict on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.subDistrict).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
