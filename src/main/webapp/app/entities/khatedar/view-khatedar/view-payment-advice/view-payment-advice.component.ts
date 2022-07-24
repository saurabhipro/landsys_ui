import { Component, Input, OnInit } from '@angular/core';
import { ISurvey } from '../../../survey/survey.model';
import { IPaymentAdviceDetails } from '../../../payment-advice-details/payment-advice-details.model';
import { IPaymentAdvice } from '../../../payment-advice/payment-advice.model';

@Component({
  selector: 'jhi-view-payment-advice',
  templateUrl: './view-payment-advice.component.html',
  styleUrls: ['./view-payment-advice.component.scss'],
})
export class ViewPaymentAdviceComponent {
  @Input() paymentAdvice: IPaymentAdvice | undefined;
}
