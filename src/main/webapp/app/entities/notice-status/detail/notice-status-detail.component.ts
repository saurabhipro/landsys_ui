import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INoticeStatus } from '../notice-status.model';

@Component({
  selector: 'jhi-notice-status-detail',
  templateUrl: './notice-status-detail.component.html',
})
export class NoticeStatusDetailComponent implements OnInit {
  noticeStatus: INoticeStatus | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ noticeStatus }) => {
      this.noticeStatus = noticeStatus;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
