import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NoticeStatusDetailComponent } from './notice-status-detail.component';

describe('NoticeStatus Management Detail Component', () => {
  let comp: NoticeStatusDetailComponent;
  let fixture: ComponentFixture<NoticeStatusDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticeStatusDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ noticeStatus: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NoticeStatusDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NoticeStatusDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load noticeStatus on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.noticeStatus).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
