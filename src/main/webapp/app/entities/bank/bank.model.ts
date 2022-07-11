import { IBankBranch } from 'app/entities/bank-branch/bank-branch.model';

export interface IBank {
  id?: number;
  name?: string;
  code?: string;
  bankNames?: IBankBranch[];
}

export class Bank implements IBank {
  constructor(public id?: number, public name?: string, public code?: string, public bankNames?: IBankBranch[]) {}
}

export function getBankIdentifier(bank: IBank): number | undefined {
  return bank.id;
}
