import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { IPaymentFile } from 'app/entities/payment-file/payment-file.model';
import { KhatedarStatus } from 'app/entities/enumerations/khatedar-status.model';

export interface IKhatedar {
  id?: number;
  caseFileNo?: string;
  remarks?: string;
  khatedarStatus?: KhatedarStatus;
  projectLand?: IProjectLand;
  citizen?: ICitizen;
  paymentAdvice?: IPaymentAdvice | null;
  paymentFile?: IPaymentFile | null;
}

export class Khatedar implements IKhatedar {
  constructor(
    public id?: number,
    public caseFileNo?: string,
    public remarks?: string,
    public khatedarStatus?: KhatedarStatus,
    public projectLand?: IProjectLand,
    public citizen?: ICitizen,
    public paymentAdvice?: IPaymentAdvice | null,
    public paymentFile?: IPaymentFile | null
  ) {}
}

export function getKhatedarIdentifier(khatedar: IKhatedar): number | undefined {
  return khatedar.id;
}
