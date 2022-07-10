import dayjs from 'dayjs/esm';
import { IProjectLand } from 'app/entities/project-land/project-land.model';

export interface IProject {
  id?: number;
  name?: string;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  budget?: number;
  approver1?: string | null;
  approver2?: string | null;
  approver3?: string | null;
  projectLands?: IProjectLand[] | null;
}

export class Project implements IProject {
  constructor(
    public id?: number,
    public name?: string,
    public startDate?: dayjs.Dayjs,
    public endDate?: dayjs.Dayjs,
    public budget?: number,
    public approver1?: string | null,
    public approver2?: string | null,
    public approver3?: string | null,
    public projectLands?: IProjectLand[] | null
  ) {}
}

export function getProjectIdentifier(project: IProject): number | undefined {
  return project.id;
}
