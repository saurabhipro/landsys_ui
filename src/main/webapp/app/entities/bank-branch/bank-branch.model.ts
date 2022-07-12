import { IBank } from 'app/entities/bank/bank.model';
import { ICitizen } from 'app/entities/citizen/citizen.model';

export interface IBankBranch {
  id?: number;
  name?: string;
  ifsc?: string;
  address?: string;
  bank?: IBank;
  citizens?: ICitizen[] | null;
}

export class BankBranch implements IBankBranch {
  constructor(
    public id?: number,
    public name?: string,
    public ifsc?: string,
    public address?: string,
    public bank?: IBank,
    public citizens?: ICitizen[] | null
  ) {}
}

export function getBankBranchIdentifier(bankBranch: IBankBranch): number | undefined {
  return bankBranch.id;
}
