import dayjs from 'dayjs/esm';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { IBank } from 'app/entities/bank/bank.model';
import { IBankBranch } from 'app/entities/bank-branch/bank-branch.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';

export interface IPaymentFile {
  id?: number;
  paymentFileId?: number;
  totalPaymentAmount?: number;
  paymentFileDate?: dayjs.Dayjs | null;
  paymentStatus?: PaymentStatus;
  bankName?: string | null;
  ifscCode?: string | null;
  paymentMode?: PaymentAdviceType | null;
  khatedar?: IKhatedar;
  paymentAdvice?: IPaymentAdvice;
  projectLand?: IProjectLand;
  survey?: ISurvey;
  bank?: IBank;
  bankBranch?: IBankBranch;
  landCompensation?: ILandCompensation;
}

export class PaymentFile implements IPaymentFile {
  constructor(
    public id?: number,
    public paymentFileId?: number,
    public totalPaymentAmount?: number,
    public paymentFileDate?: dayjs.Dayjs | null,
    public paymentStatus?: PaymentStatus,
    public bankName?: string | null,
    public ifscCode?: string | null,
    public paymentMode?: PaymentAdviceType | null,
    public khatedar?: IKhatedar,
    public paymentAdvice?: IPaymentAdvice,
    public projectLand?: IProjectLand,
    public survey?: ISurvey,
    public bank?: IBank,
    public bankBranch?: IBankBranch,
    public landCompensation?: ILandCompensation
  ) {}
}

export function getPaymentFileIdentifier(paymentFile: IPaymentFile): number | undefined {
  return paymentFile.id;
}
