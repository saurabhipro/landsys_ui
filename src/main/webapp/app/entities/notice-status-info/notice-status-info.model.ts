import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { NoticeStatus } from 'app/entities/enumerations/notice-status.model';

export interface INoticeStatusInfo {
  id?: number;
  status?: NoticeStatus | null;
  projectLands?: IProjectLand[] | null;
}

export class NoticeStatusInfo implements INoticeStatusInfo {
  constructor(public id?: number, public status?: NoticeStatus | null, public projectLands?: IProjectLand[] | null) {}
}

export function getNoticeStatusInfoIdentifier(noticeStatusInfo: INoticeStatusInfo): number | undefined {
  return noticeStatusInfo.id;
}
