import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICitizen } from '../../../citizen/citizen.model';

@Component({
  selector: 'jhi-view-citizen',
  templateUrl: './view-citizen.component.html',
  styleUrls: ['./view-citizen.component.scss'],
})
export class ViewCitizenComponent {
  @Input()
  citizen!: ICitizen;
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  previousState(): void {
    window.history.back();
  }
}
