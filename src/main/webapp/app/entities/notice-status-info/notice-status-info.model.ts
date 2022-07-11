import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { NoticeStatus } from 'app/entities/enumerations/notice-status.model';

export interface INoticeStatusInfo {
  id?: number;
  status?: NoticeStatus | null;
  khatedars?: IKhatedar[];
  projectLands?: IProjectLand[];
}

export class NoticeStatusInfo implements INoticeStatusInfo {
  constructor(
    public id?: number,
    public status?: NoticeStatus | null,
    public khatedars?: IKhatedar[],
    public projectLands?: IProjectLand[]
  ) {}
}

export function getNoticeStatusInfoIdentifier(noticeStatusInfo: INoticeStatusInfo): number | undefined {
  return noticeStatusInfo.id;
}
