import { ILand } from 'app/entities/land/land.model';
import { IProject } from 'app/entities/project/project.model';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { INoticeStatusInfo } from 'app/entities/notice-status-info/notice-status-info.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { IPaymentAdviceDetails } from 'app/entities/payment-advice-details/payment-advice-details.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

export interface IProjectLand {
  id?: number;
  remarks?: string | null;
  documentsContentType?: string | null;
  documents?: string | null;
  hissaType?: HissaType | null;
  land?: ILand | null;
  project?: IProject;
  citizen?: ICitizen;
  noticeStatusInfo?: INoticeStatusInfo;
  survey?: ISurvey | null;
  landCompensation?: ILandCompensation | null;
  paymentAdvices?: IPaymentAdvice[] | null;
  paymentAdviceDetails?: IPaymentAdviceDetails[] | null;
}

export class ProjectLand implements IProjectLand {
  constructor(
    public id?: number,
    public remarks?: string | null,
    public documentsContentType?: string | null,
    public documents?: string | null,
    public hissaType?: HissaType | null,
    public land?: ILand | null,
    public project?: IProject,
    public citizen?: ICitizen,
    public noticeStatusInfo?: INoticeStatusInfo,
    public survey?: ISurvey | null,
    public landCompensation?: ILandCompensation | null,
    public paymentAdvices?: IPaymentAdvice[] | null,
    public paymentAdviceDetails?: IPaymentAdviceDetails[] | null
  ) {}
}

export function getProjectLandIdentifier(projectLand: IProjectLand): number | undefined {
  return projectLand.id;
}
