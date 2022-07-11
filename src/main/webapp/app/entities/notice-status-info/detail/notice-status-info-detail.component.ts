import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INoticeStatusInfo } from '../notice-status-info.model';

@Component({
  selector: 'jhi-notice-status-info-detail',
  templateUrl: './notice-status-info-detail.component.html',
})
export class NoticeStatusInfoDetailComponent implements OnInit {
  noticeStatusInfo: INoticeStatusInfo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ noticeStatusInfo }) => {
      this.noticeStatusInfo = noticeStatusInfo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
