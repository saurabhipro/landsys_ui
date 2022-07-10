import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISubDistrict } from '../sub-district.model';

@Component({
  selector: 'jhi-sub-district-detail',
  templateUrl: './sub-district-detail.component.html',
})
export class SubDistrictDetailComponent implements OnInit {
  subDistrict: ISubDistrict | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subDistrict }) => {
      this.subDistrict = subDistrict;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
