import { IProject } from 'app/entities/project/project.model';
import { ILand } from 'app/entities/land/land.model';
import { INoticeStatusInfo } from 'app/entities/notice-status-info/notice-status-info.model';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

export interface IProjectLand {
  id?: number;
  remarks?: string | null;
  documentsContentType?: string | null;
  documents?: string | null;
  hissaType?: HissaType | null;
  project?: IProject;
  land?: ILand;
  noticeStatusInfo?: INoticeStatusInfo | null;
  khatedars?: IKhatedar[];
  surveys?: ISurvey[];
  landCompensations?: ILandCompensation[];
  paymentAdvices?: IPaymentAdvice[];
}

export class ProjectLand implements IProjectLand {
  constructor(
    public id?: number,
    public remarks?: string | null,
    public documentsContentType?: string | null,
    public documents?: string | null,
    public hissaType?: HissaType | null,
    public project?: IProject,
    public land?: ILand,
    public noticeStatusInfo?: INoticeStatusInfo | null,
    public khatedars?: IKhatedar[],
    public surveys?: ISurvey[],
    public landCompensations?: ILandCompensation[],
    public paymentAdvices?: IPaymentAdvice[]
  ) {}
}

export function getProjectLandIdentifier(projectLand: IProjectLand): number | undefined {
  return projectLand.id;
}
