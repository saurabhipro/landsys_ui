import dayjs from 'dayjs/esm';
import { ProjectStatus } from 'app/entities/enumerations/project-status.model';

export interface IProjectStatusHistory {
  id?: number;
  status?: ProjectStatus | null;
  when?: dayjs.Dayjs | null;
  remarks?: string | null;
}

export class ProjectStatusHistory implements IProjectStatusHistory {
  constructor(public id?: number, public status?: ProjectStatus | null, public when?: dayjs.Dayjs | null, public remarks?: string | null) {}
}

export function getProjectStatusHistoryIdentifier(projectStatusHistory: IProjectStatusHistory): number | undefined {
  return projectStatusHistory.id;
}
