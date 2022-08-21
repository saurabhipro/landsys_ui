import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ICitizen } from '../../../citizen/citizen.model';

@Component({
  selector: 'jhi-view-citizen',
  templateUrl: './view-citizen.component.html',
  styleUrls: ['./view-citizen.component.scss'],
})
export class ViewCitizenComponent implements OnInit {
  @Input()
  citizen!: ICitizen;
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  ngOnInit(): void {
    console.log('VIEW CITIZEN');
  }

  previousState(): void {
    window.history.back();
  }
}
