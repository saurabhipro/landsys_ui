import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SequenceGenDetailComponent } from './sequence-gen-detail.component';

describe('SequenceGen Management Detail Component', () => {
  let comp: SequenceGenDetailComponent;
  let fixture: ComponentFixture<SequenceGenDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SequenceGenDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sequenceGen: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SequenceGenDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SequenceGenDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sequenceGen on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sequenceGen).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
