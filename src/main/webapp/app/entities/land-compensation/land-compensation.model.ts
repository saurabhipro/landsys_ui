import dayjs from 'dayjs/esm';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
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
  status?: CompensationStatus | null;
  orderDate?: dayjs.Dayjs | null;
  paymentAmount?: number | null;
  transactionId?: string | null;
  khatedar?: IKhatedar;
  survey?: ISurvey;
  projectLand?: IProjectLand;
  paymentAdvices?: IPaymentAdvice[] | null;
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
    public transactionId?: string | null,
    public khatedar?: IKhatedar,
    public survey?: ISurvey,
    public projectLand?: IProjectLand,
    public paymentAdvices?: IPaymentAdvice[] | null
  ) {}
}

export function getLandCompensationIdentifier(landCompensation: ILandCompensation): number | undefined {
  return landCompensation.id;
}
