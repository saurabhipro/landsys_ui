import { ILand } from 'app/entities/land/land.model';
import { IProject } from 'app/entities/project/project.model';
import { IVillage } from 'app/entities/village/village.model';
import { INoticeStatusInfo } from 'app/entities/notice-status-info/notice-status-info.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { IPaymentAdviceDetails } from 'app/entities/payment-advice-details/payment-advice-details.model';
import { IPaymentFile } from 'app/entities/payment-file/payment-file.model';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

export interface IProjectLand {
  id?: number;
  remarks?: string | null;
  documentsContentType?: string | null;
  documents?: string | null;
  hissaType?: HissaType | null;
  land?: ILand;
  project?: IProject;
  village?: IVillage;
  noticeStatusInfo?: INoticeStatusInfo | null;
  survey?: ISurvey | null;
  landCompensation?: ILandCompensation | null;
  paymentAdvices?: IPaymentAdvice[] | null;
  paymentAdviceDetails?: IPaymentAdviceDetails[] | null;
  paymentFiles?: IPaymentFile[] | null;
  khatedars?: IKhatedar[] | null;
}

export class ProjectLand implements IProjectLand {
  constructor(
    public id?: number,
    public remarks?: string | null,
    public documentsContentType?: string | null,
    public documents?: string | null,
    public hissaType?: HissaType | null,
    public land?: ILand,
    public project?: IProject,
    public village?: IVillage,
    public noticeStatusInfo?: INoticeStatusInfo | null,
    public survey?: ISurvey | null,
    public landCompensation?: ILandCompensation | null,
    public paymentAdvices?: IPaymentAdvice[] | null,
    public paymentAdviceDetails?: IPaymentAdviceDetails[] | null,
    public paymentFiles?: IPaymentFile[] | null,
    public khatedars?: IKhatedar[] | null
  ) {}
}

export function getProjectLandIdentifier(projectLand: IProjectLand): number | undefined {
  return projectLand.id;
}
