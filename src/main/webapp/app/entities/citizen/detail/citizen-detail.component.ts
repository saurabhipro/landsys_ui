import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICitizen } from '../citizen.model';
import { ICitizenInfo } from '../citizeninfo.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-citizen-detail',
  templateUrl: './citizen-detail.component.html',
})
export class CitizenDetailComponent implements OnInit {
  citizen: ICitizen | null = null;
  citizenInfo?: ICitizenInfo[];

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ citizen }) => {
      this.citizen = citizen.citizen;
      this.citizenInfo = citizen.citizenInfo;
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
