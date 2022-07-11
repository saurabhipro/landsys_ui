import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NoticeStatusInfoDetailComponent } from './notice-status-info-detail.component';

describe('NoticeStatusInfo Management Detail Component', () => {
  let comp: NoticeStatusInfoDetailComponent;
  let fixture: ComponentFixture<NoticeStatusInfoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticeStatusInfoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ noticeStatusInfo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NoticeStatusInfoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NoticeStatusInfoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load noticeStatusInfo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.noticeStatusInfo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
