import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKhatedar } from '../khatedar.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-khatedar-detail',
  templateUrl: './khatedar-detail.component.html',
})
export class KhatedarDetailComponent implements OnInit {
  khatedar: IKhatedar | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ khatedar }) => {
      this.khatedar = khatedar;
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
