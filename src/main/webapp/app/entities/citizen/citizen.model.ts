import { IBankBranch } from 'app/entities/bank-branch/bank-branch.model';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';

export interface ICitizen {
  id?: number;
  photoContentType?: string | null;
  photo?: string | null;
  name?: string;
  address?: string;
  accountNumber?: string | null;
  fatherName?: string;
  spouseName?: string | null;
  successorName?: string | null;
  aadhar?: string;
  pan?: string | null;
  aadharImageContentType?: string | null;
  aadharImage?: string | null;
  panImageContentType?: string | null;
  panImage?: string | null;
  accountNo?: string | null;
  accNoImageContentType?: string | null;
  accNoImage?: string | null;
  bankBranch?: IBankBranch;
  khatedars?: IKhatedar[];
}

export class Citizen implements ICitizen {
  constructor(
    public id?: number,
    public photoContentType?: string | null,
    public photo?: string | null,
    public name?: string,
    public address?: string,
    public accountNumber?: string | null,
    public fatherName?: string,
    public spouseName?: string | null,
    public successorName?: string | null,
    public aadhar?: string,
    public pan?: string | null,
    public aadharImageContentType?: string | null,
    public aadharImage?: string | null,
    public panImageContentType?: string | null,
    public panImage?: string | null,
    public accountNo?: string | null,
    public accNoImageContentType?: string | null,
    public accNoImage?: string | null,
    public bankBranch?: IBankBranch,
    public khatedars?: IKhatedar[]
  ) {}
}

export function getCitizenIdentifier(citizen: ICitizen): number | undefined {
  return citizen.id;
}
