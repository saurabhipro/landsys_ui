import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKhatedar } from '../khatedar.model';

@Component({
  selector: 'jhi-khatedar-detail',
  templateUrl: './khatedar-detail.component.html',
})
export class KhatedarDetailComponent implements OnInit {
  khatedar: IKhatedar | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ khatedar }) => {
      this.khatedar = khatedar;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
