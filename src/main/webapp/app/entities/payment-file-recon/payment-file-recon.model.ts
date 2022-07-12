import dayjs from 'dayjs/esm';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';

export interface IPaymentFileRecon {
  id?: number;
  primaryHolderName?: string;
  paymentAmount?: number;
  paymentDate?: dayjs.Dayjs | null;
  utrNumber?: string;
  referenceNumber?: string | null;
  paymentStatus?: PaymentStatus;
  paymentAdvice?: IPaymentAdvice;
}

export class PaymentFileRecon implements IPaymentFileRecon {
  constructor(
    public id?: number,
    public primaryHolderName?: string,
    public paymentAmount?: number,
    public paymentDate?: dayjs.Dayjs | null,
    public utrNumber?: string,
    public referenceNumber?: string | null,
    public paymentStatus?: PaymentStatus,
    public paymentAdvice?: IPaymentAdvice
  ) {}
}

export function getPaymentFileReconIdentifier(paymentFileRecon: IPaymentFileRecon): number | undefined {
  return paymentFileRecon.id;
}
