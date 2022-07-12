import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { IPaymentFile } from 'app/entities/payment-file/payment-file.model';
import { IPaymentFileRecon } from 'app/entities/payment-file-recon/payment-file-recon.model';
import { ILand } from 'app/entities/land/land.model';
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
  landCompensation?: ILandCompensation;
  projectLand?: IProjectLand;
  survey?: ISurvey;
  citizen?: ICitizen;
  paymentFile?: IPaymentFile | null;
  paymentFileRecon?: IPaymentFileRecon | null;
  land?: ILand | null;
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
    public landCompensation?: ILandCompensation,
    public projectLand?: IProjectLand,
    public survey?: ISurvey,
    public citizen?: ICitizen,
    public paymentFile?: IPaymentFile | null,
    public paymentFileRecon?: IPaymentFileRecon | null,
    public land?: ILand | null,
    public paymentAdviceDetails?: IPaymentAdviceDetails[] | null
  ) {}
}

export function getPaymentAdviceIdentifier(paymentAdvice: IPaymentAdvice): number | undefined {
  return paymentAdvice.id;
}
