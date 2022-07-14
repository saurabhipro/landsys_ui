import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { IPaymentFileRecon } from 'app/entities/payment-file-recon/payment-file-recon.model';
import { IPaymentFile } from 'app/entities/payment-file/payment-file.model';
import { IPaymentAdviceDetails } from 'app/entities/payment-advice-details/payment-advice-details.model';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

export interface IPaymentAdvice {
  id?: number;
  accountHolderName?: string;
  accountHolderBankName?: string;
  paymentAmount?: number;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  checkNumber?: string | null;
  micrCode?: string | null;
  paymentAdviceType?: PaymentAdviceType | null;
  referenceNumber?: string | null;
  paymentStatus?: PaymentStatus;
  hissaType?: HissaType;
  khatedar?: IKhatedar;
  landCompensation?: ILandCompensation;
  projectLand?: IProjectLand;
  survey?: ISurvey;
  paymentFileRecon?: IPaymentFileRecon | null;
  paymentFile?: IPaymentFile | null;
  paymentAdviceDetails?: IPaymentAdviceDetails[] | null;
}

export class PaymentAdvice implements IPaymentAdvice {
  constructor(
    public id?: number,
    public accountHolderName?: string,
    public accountHolderBankName?: string,
    public paymentAmount?: number,
    public bankName?: string,
    public accountNumber?: string,
    public ifscCode?: string,
    public checkNumber?: string | null,
    public micrCode?: string | null,
    public paymentAdviceType?: PaymentAdviceType | null,
    public referenceNumber?: string | null,
    public paymentStatus?: PaymentStatus,
    public hissaType?: HissaType,
    public khatedar?: IKhatedar,
    public landCompensation?: ILandCompensation,
    public projectLand?: IProjectLand,
    public survey?: ISurvey,
    public paymentFileRecon?: IPaymentFileRecon | null,
    public paymentFile?: IPaymentFile | null,
    public paymentAdviceDetails?: IPaymentAdviceDetails[] | null
  ) {}
}

export function getPaymentAdviceIdentifier(paymentAdvice: IPaymentAdvice): number | undefined {
  return paymentAdvice.id;
}
