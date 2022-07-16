import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISequenceGen } from '../sequence-gen.model';

@Component({
  selector: 'jhi-sequence-gen-detail',
  templateUrl: './sequence-gen-detail.component.html',
})
export class SequenceGenDetailComponent implements OnInit {
  sequenceGen: ISequenceGen | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sequenceGen }) => {
      this.sequenceGen = sequenceGen;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
