import dayjs from 'dayjs/esm';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';

export interface IPaymentFile {
  id?: number;
  paymentFileId?: number;
  totalPaymentAmount?: number;
  paymentFileDate?: dayjs.Dayjs | null;
  paymentStatus?: PaymentStatus;
  bankName?: string | null;
  ifscCode?: string | null;
  paymentAdvices?: IPaymentAdvice[];
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
    public paymentAdvices?: IPaymentAdvice[]
  ) {}
}

export function getPaymentFileIdentifier(paymentFile: IPaymentFile): number | undefined {
  return paymentFile.id;
}
