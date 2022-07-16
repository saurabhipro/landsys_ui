import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SequenceGeneratorDetailComponent } from './sequence-generator-detail.component';

describe('SequenceGenerator Management Detail Component', () => {
  let comp: SequenceGeneratorDetailComponent;
  let fixture: ComponentFixture<SequenceGeneratorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SequenceGeneratorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sequenceGenerator: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SequenceGeneratorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SequenceGeneratorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sequenceGenerator on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sequenceGenerator).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
