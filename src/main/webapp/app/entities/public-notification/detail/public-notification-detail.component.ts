import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPublicNotification } from '../public-notification.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-public-notification-detail',
  templateUrl: './public-notification-detail.component.html',
})
export class PublicNotificationDetailComponent implements OnInit {
  publicNotification: IPublicNotification | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ publicNotification }) => {
      this.publicNotification = publicNotification;
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
