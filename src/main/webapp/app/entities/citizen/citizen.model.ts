import dayjs from 'dayjs/esm';
import { ILand } from 'app/entities/land/land.model';
import { IBankBranch } from 'app/entities/bank-branch/bank-branch.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';

export interface ICitizen {
  id?: number;
  photoContentType?: string | null;
  photo?: string | null;
  name?: string;
  address?: string;
  mobileNo?: string | null;
  dob?: dayjs.Dayjs | null;
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
  lands?: ILand[] | null;
  bankBranch?: IBankBranch;
  projectLands?: IProjectLand[] | null;
  paymentAdvices?: IPaymentAdvice[] | null;
}

export class Citizen implements ICitizen {
  constructor(
    public id?: number,
    public photoContentType?: string | null,
    public photo?: string | null,
    public name?: string,
    public address?: string,
    public mobileNo?: string | null,
    public dob?: dayjs.Dayjs | null,
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
    public lands?: ILand[] | null,
    public bankBranch?: IBankBranch,
    public projectLands?: IProjectLand[] | null,
    public paymentAdvices?: IPaymentAdvice[] | null
  ) {}
}

export function getCitizenIdentifier(citizen: ICitizen): number | undefined {
  return citizen.id;
}
