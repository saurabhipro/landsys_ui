export interface ITransactionHistory {
  id?: number;
  projectName?: string;
  khasraNumber?: string;
  state?: string;
  citizenName?: string;
  citizenAadhar?: string;
  surveyerName?: string | null;
  landValue?: string;
  paymentAmount?: number | null;
  accountNumber?: string | null;
  bankName?: string | null;
  transactionId?: string | null;
  transactionType?: string | null;
  eventType?: string | null;
  eventStatus?: string | null;
  approver1?: string | null;
  approver2?: string | null;
  approver3?: string | null;
}

export class TransactionHistory implements ITransactionHistory {
  constructor(
    public id?: number,
    public projectName?: string,
    public khasraNumber?: string,
    public state?: string,
    public citizenName?: string,
    public citizenAadhar?: string,
    public surveyerName?: string | null,
    public landValue?: string,
    public paymentAmount?: number | null,
    public accountNumber?: string | null,
    public bankName?: string | null,
    public transactionId?: string | null,
    public transactionType?: string | null,
    public eventType?: string | null,
    public eventStatus?: string | null,
    public approver1?: string | null,
    public approver2?: string | null,
    public approver3?: string | null
  ) {}
}

export function getTransactionHistoryIdentifier(transactionHistory: ITransactionHistory): number | undefined {
  return transactionHistory.id;
}
