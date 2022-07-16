import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISequenceGenerator } from '../sequence-generator.model';

@Component({
  selector: 'jhi-sequence-generator-detail',
  templateUrl: './sequence-generator-detail.component.html',
})
export class SequenceGeneratorDetailComponent implements OnInit {
  sequenceGenerator: ISequenceGenerator | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sequenceGenerator }) => {
      this.sequenceGenerator = sequenceGenerator;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
