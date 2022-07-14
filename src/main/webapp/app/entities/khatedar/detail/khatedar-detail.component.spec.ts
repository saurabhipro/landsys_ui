import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { KhatedarDetailComponent } from './khatedar-detail.component';

describe('Khatedar Management Detail Component', () => {
  let comp: KhatedarDetailComponent;
  let fixture: ComponentFixture<KhatedarDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KhatedarDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ khatedar: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(KhatedarDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(KhatedarDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load khatedar on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.khatedar).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
