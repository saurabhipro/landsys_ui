import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

export interface IPaymentAdviceDetails {
  id?: number;
  landOwners?: string;
  hissaType?: HissaType;
  paymentAdvice?: IPaymentAdvice;
  projectLand?: IProjectLand;
  khatedar?: IKhatedar;
}

export class PaymentAdviceDetails implements IPaymentAdviceDetails {
  constructor(
    public id?: number,
    public landOwners?: string,
    public hissaType?: HissaType,
    public paymentAdvice?: IPaymentAdvice,
    public projectLand?: IProjectLand,
    public khatedar?: IKhatedar
  ) {}
}

export function getPaymentAdviceDetailsIdentifier(paymentAdviceDetails: IPaymentAdviceDetails): number | undefined {
  return paymentAdviceDetails.id;
}
