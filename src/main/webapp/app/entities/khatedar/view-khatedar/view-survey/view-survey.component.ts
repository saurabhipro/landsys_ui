import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICitizen } from '../../../citizen/citizen.model';
import { ISurvey } from '../../../survey/survey.model';

@Component({
  selector: 'jhi-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss'],
})
export class ViewSurveyComponent {
  @Input() survey: ISurvey | undefined;
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  previousState(): void {
    window.history.back();
  }
}
