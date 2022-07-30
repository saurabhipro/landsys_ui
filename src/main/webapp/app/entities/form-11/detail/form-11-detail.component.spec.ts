import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Form11DetailComponent } from './form-11-detail.component';

describe('Form11 Management Detail Component', () => {
  let comp: Form11DetailComponent;
  let fixture: ComponentFixture<Form11DetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Form11DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ form11: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(Form11DetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(Form11DetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load form11 on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.form11).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
