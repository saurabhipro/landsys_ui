import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StateDetailComponent } from './state-detail.component';

describe('State Management Detail Component', () => {
  let comp: StateDetailComponent;
  let fixture: ComponentFixture<StateDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ state: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StateDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StateDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load state on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.state).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
