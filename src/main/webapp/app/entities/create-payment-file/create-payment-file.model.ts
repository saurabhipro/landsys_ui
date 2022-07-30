import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

export interface ICreatePaymentFile {
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
}

export class CreatePaymentFile implements ICreatePaymentFile {
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
    public hissaType?: HissaType
  ) {}
}

export function getCreatePaymentFileIdentifier(createPaymentFile: ICreatePaymentFile): number | undefined {
  return createPaymentFile.id;
}
