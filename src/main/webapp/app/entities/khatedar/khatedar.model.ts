import { ICitizen } from 'app/entities/citizen/citizen.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { INoticeStatusInfo } from 'app/entities/notice-status-info/notice-status-info.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { KhatedarStatus } from 'app/entities/enumerations/khatedar-status.model';

export interface IKhatedar {
  id?: number;
  caseFileNo?: string | null;
  remarks?: string | null;
  noticeFileContentType?: string | null;
  noticeFile?: string | null;
  status?: KhatedarStatus | null;
  citizen?: ICitizen | null;
  projectLand?: IProjectLand | null;
  noticeStatusInfo?: INoticeStatusInfo | null;
  survey?: ISurvey;
  landCompensations?: ILandCompensation[];
}

export class Khatedar implements IKhatedar {
  constructor(
    public id?: number,
    public caseFileNo?: string | null,
    public remarks?: string | null,
    public noticeFileContentType?: string | null,
    public noticeFile?: string | null,
    public status?: KhatedarStatus | null,
    public citizen?: ICitizen | null,
    public projectLand?: IProjectLand | null,
    public noticeStatusInfo?: INoticeStatusInfo | null,
    public survey?: ISurvey,
    public landCompensations?: ILandCompensation[]
  ) {}
}

export function getKhatedarIdentifier(khatedar: IKhatedar): number | undefined {
  return khatedar.id;
}
