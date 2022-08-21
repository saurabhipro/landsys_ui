import { ICitizen } from 'app/entities/citizen/citizen.model';
import { ILand } from 'app/entities/land/land.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';

export interface ICitizenInfo {
  projectName?: string;
  land?: ILand | null;
  survey?: ISurvey | null;
  compensation?: ILandCompensation | null;
  paymentAdvice?: IPaymentAdvice | null;
}

export class CitizenInfo implements ICitizenInfo {
  constructor(
    projectName?: string,
    citizen?: ICitizen | null,
    land?: ILand[] | null,
    survey?: ISurvey | null,
    compensation?: ILandCompensation[] | null,
    paymentAdvice?: IPaymentAdvice[] | null
  ) {}
}
