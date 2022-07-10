import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

export interface IPaymentAdvice {
  id?: number;
  accountHolderName?: string;
  paymentAmount?: number;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  checkNumber?: string | null;
  micrCode?: string | null;
  paymentAdviceType?: PaymentAdviceType | null;
  referenceNumber?: string | null;
  paymentStatus?: PaymentStatus;
  hisssaType?: HissaType;
  landCompensation?: ILandCompensation;
  projectLand?: IProjectLand;
}

export class PaymentAdvice implements IPaymentAdvice {
  constructor(
    public id?: number,
    public accountHolderName?: string,
    public paymentAmount?: number,
    public bankName?: string,
    public accountNumber?: string,
    public ifscCode?: string,
    public checkNumber?: string | null,
    public micrCode?: string | null,
    public paymentAdviceType?: PaymentAdviceType | null,
    public referenceNumber?: string | null,
    public paymentStatus?: PaymentStatus,
    public hisssaType?: HissaType,
    public landCompensation?: ILandCompensation,
    public projectLand?: IProjectLand
  ) {}
}

export function getPaymentAdviceIdentifier(paymentAdvice: IPaymentAdvice): number | undefined {
  return paymentAdvice.id;
}
