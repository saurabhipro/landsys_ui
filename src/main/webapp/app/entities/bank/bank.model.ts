import { IBankBranch } from 'app/entities/bank-branch/bank-branch.model';
import { IPaymentFile } from 'app/entities/payment-file/payment-file.model';

export interface IBank {
  id?: number;
  name?: string;
  code?: string;
  bankBranches?: IBankBranch[] | null;
  paymentFiles?: IPaymentFile[] | null;
}

export class Bank implements IBank {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public bankBranches?: IBankBranch[] | null,
    public paymentFiles?: IPaymentFile[] | null
  ) {}
}

export function getBankIdentifier(bank: IBank): number | undefined {
  return bank.id;
}
