import { Component, Input, OnInit } from '@angular/core';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';

@Component({
  selector: 'jhi-view-compensation',
  templateUrl: './view-compensation.component.html',
  styleUrls: ['./view-compensation.component.scss'],
})
export class ViewCompensationComponent {
  @Input() landCompensation: ILandCompensation | undefined;
}
