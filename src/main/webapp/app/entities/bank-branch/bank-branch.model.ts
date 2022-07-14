import { IBank } from 'app/entities/bank/bank.model';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { IPaymentFile } from 'app/entities/payment-file/payment-file.model';

export interface IBankBranch {
  id?: number;
  name?: string;
  ifsc?: string;
  address?: string;
  bank?: IBank;
  citizens?: ICitizen[] | null;
  paymentFiles?: IPaymentFile[] | null;
}

export class BankBranch implements IBankBranch {
  constructor(
    public id?: number,
    public name?: string,
    public ifsc?: string,
    public address?: string,
    public bank?: IBank,
    public citizens?: ICitizen[] | null,
    public paymentFiles?: IPaymentFile[] | null
  ) {}
}

export function getBankBranchIdentifier(bankBranch: IBankBranch): number | undefined {
  return bankBranch.id;
}
