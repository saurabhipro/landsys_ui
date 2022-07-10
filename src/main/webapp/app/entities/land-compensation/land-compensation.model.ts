import dayjs from 'dayjs/esm';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

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
  status?: string | null;
  orderDate?: dayjs.Dayjs | null;
  paymentDate?: dayjs.Dayjs | null;
  paymentAmount?: number | null;
  transactionId?: string | null;
  paymentAdvice?: IPaymentAdvice;
  khatedar?: IKhatedar | null;
  survey?: ISurvey;
  projectLand?: IProjectLand;
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
    public status?: string | null,
    public orderDate?: dayjs.Dayjs | null,
    public paymentDate?: dayjs.Dayjs | null,
    public paymentAmount?: number | null,
    public transactionId?: string | null,
    public paymentAdvice?: IPaymentAdvice,
    public khatedar?: IKhatedar | null,
    public survey?: ISurvey,
    public projectLand?: IProjectLand
  ) {}
}

export function getLandCompensationIdentifier(landCompensation: ILandCompensation): number | undefined {
  return landCompensation.id;
}
