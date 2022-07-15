import { IProject } from 'app/entities/project/project.model';
import { IPaymentFile } from 'app/entities/payment-file/payment-file.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';

export interface IPaymentFileHeader {
  id?: number;
  grandTotalPaymentAmount?: number;
  paymentStatus?: PaymentStatus;
  paymentMode?: PaymentAdviceType | null;
  approverRemarks?: string | null;
  project?: IProject;
  paymentFiles?: IPaymentFile[] | null;
}

export class PaymentFileHeader implements IPaymentFileHeader {
  constructor(
    public id?: number,
    public grandTotalPaymentAmount?: number,
    public paymentStatus?: PaymentStatus,
    public paymentMode?: PaymentAdviceType | null,
    public approverRemarks?: string | null,
    public project?: IProject,
    public paymentFiles?: IPaymentFile[] | null
  ) {}
}

export function getPaymentFileHeaderIdentifier(paymentFileHeader: IPaymentFileHeader): number | undefined {
  return paymentFileHeader.id;
}
