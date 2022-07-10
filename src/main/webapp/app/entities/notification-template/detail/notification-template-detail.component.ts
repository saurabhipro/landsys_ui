import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INotificationTemplate } from '../notification-template.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-notification-template-detail',
  templateUrl: './notification-template-detail.component.html',
})
export class NotificationTemplateDetailComponent implements OnInit {
  notificationTemplate: INotificationTemplate | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ notificationTemplate }) => {
      this.notificationTemplate = notificationTemplate;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
