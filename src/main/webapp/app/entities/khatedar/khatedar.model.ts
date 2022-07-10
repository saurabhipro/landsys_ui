import { ISurvey } from 'app/entities/survey/survey.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { KhatedayStatus } from 'app/entities/enumerations/khateday-status.model';

export interface IKhatedar {
  id?: number;
  caseFileNo?: string | null;
  remarks?: string | null;
  noticeFileContentType?: string | null;
  noticeFile?: string | null;
  status?: KhatedayStatus | null;
  surveys?: ISurvey[] | null;
  landCompensations?: ILandCompensation[] | null;
  citizen?: ICitizen;
  projectLand?: IProjectLand;
}

export class Khatedar implements IKhatedar {
  constructor(
    public id?: number,
    public caseFileNo?: string | null,
    public remarks?: string | null,
    public noticeFileContentType?: string | null,
    public noticeFile?: string | null,
    public status?: KhatedayStatus | null,
    public surveys?: ISurvey[] | null,
    public landCompensations?: ILandCompensation[] | null,
    public citizen?: ICitizen,
    public projectLand?: IProjectLand
  ) {}
}

export function getKhatedarIdentifier(khatedar: IKhatedar): number | undefined {
  return khatedar.id;
}
