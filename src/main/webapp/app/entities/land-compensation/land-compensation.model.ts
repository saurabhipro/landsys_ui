import dayjs from 'dayjs/esm';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { IPaymentFile } from 'app/entities/payment-file/payment-file.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { CompensationStatus } from 'app/entities/enumerations/compensation-status.model';

export interface ILandCompensation {
  id?: number;
  hissaType?: HissaType;
  area?: number;
  sharePercentage?: number;
  landMarketValue?: number;
  structuralCompensation?: number | null;
  horticultureCompensation?: number | null;
  forestCompensation?: number | null;
  solatiumMoney?: number | null;
  additionalCompensation?: number | null;
  compensationStatus?: CompensationStatus | null;
  orderDate?: dayjs.Dayjs | null;
  paymentAmount?: number | null;
  interestRate?: number | null;
  interestDays?: number | null;
  transactionId?: string | null;
  projectLand?: IProjectLand;
  survey?: ISurvey;
  paymentAdvices?: IPaymentAdvice[] | null;
  paymentFiles?: IPaymentFile[] | null;
}

export class LandCompensation implements ILandCompensation {
  constructor(
    public id?: number,
    public hissaType?: HissaType,
    public area?: number,
    public sharePercentage?: number,
    public landMarketValue?: number,
    public structuralCompensation?: number | null,
    public horticultureCompensation?: number | null,
    public forestCompensation?: number | null,
    public solatiumMoney?: number | null,
    public additionalCompensation?: number | null,
    public status?: CompensationStatus | null,
    public orderDate?: dayjs.Dayjs | null,
    public paymentAmount?: number | null,
    public interestRate?: number | null,
    public interestDays?: number | null,
    public transactionId?: string | null,
    public projectLand?: IProjectLand,
    public survey?: ISurvey,
    public paymentAdvices?: IPaymentAdvice[] | null,
    public paymentFiles?: IPaymentFile[] | null
  ) {}
}

export function getLandCompensationIdentifier(landCompensation: ILandCompensation): number | undefined {
  return landCompensation.id;
}
