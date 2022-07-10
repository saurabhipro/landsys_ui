import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProjectStatusHistoryDetailComponent } from './project-status-history-detail.component';

describe('ProjectStatusHistory Management Detail Component', () => {
  let comp: ProjectStatusHistoryDetailComponent;
  let fixture: ComponentFixture<ProjectStatusHistoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectStatusHistoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ projectStatusHistory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProjectStatusHistoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProjectStatusHistoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load projectStatusHistory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.projectStatusHistory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
