import dayjs from 'dayjs/esm';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { IBank } from 'app/entities/bank/bank.model';
import { IBankBranch } from 'app/entities/bank-branch/bank-branch.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { IPaymentFileHeader } from 'app/entities/payment-file-header/payment-file-header.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';

export interface IPaymentFile {
  id?: number;
  paymentFileId?: number;
  totalPaymentAmount?: number;
  khatedarIfscCode?: string | null;
  paymentFileDate?: dayjs.Dayjs | null;
  paymentFileStatus?: PaymentStatus;
  paymentMode?: PaymentAdviceType;
  khatedar?: IKhatedar;
  paymentAdvice?: IPaymentAdvice;
  projectLand?: IProjectLand;
  survey?: ISurvey;
  bank?: IBank;
  bankBranch?: IBankBranch;
  landCompensation?: ILandCompensation;
  paymentFileHeader?: IPaymentFileHeader;
}

export class PaymentFile implements IPaymentFile {
  constructor(
    public id?: number,
    public paymentFileId?: number,
    public totalPaymentAmount?: number,
    public paymentFileDate?: dayjs.Dayjs | null,
    public paymentFileStatus?: PaymentStatus,
    public khatedarIfscCode?: string | null,
    public paymentMode?: PaymentAdviceType,
    public khatedar?: IKhatedar,
    public paymentAdvice?: IPaymentAdvice,
    public projectLand?: IProjectLand,
    public survey?: ISurvey,
    public bank?: IBank,
    public bankBranch?: IBankBranch,
    public landCompensation?: ILandCompensation,
    public paymentFileHeader?: IPaymentFileHeader
  ) {}
}

export function getPaymentFileIdentifier(paymentFile: IPaymentFile): number | undefined {
  return paymentFile.id;
}
