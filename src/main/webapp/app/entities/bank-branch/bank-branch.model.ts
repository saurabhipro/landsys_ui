import { ICitizen } from 'app/entities/citizen/citizen.model';
import { IBank } from 'app/entities/bank/bank.model';

export interface IBankBranch {
  id?: number;
  name?: string;
  ifsc?: string;
  address?: string;
  citizens?: ICitizen[] | null;
  bank?: IBank;
}

export class BankBranch implements IBankBranch {
  constructor(
    public id?: number,
    public name?: string,
    public ifsc?: string,
    public address?: string,
    public citizens?: ICitizen[] | null,
    public bank?: IBank
  ) {}
}

export function getBankBranchIdentifier(bankBranch: IBankBranch): number | undefined {
  return bankBranch.id;
}
