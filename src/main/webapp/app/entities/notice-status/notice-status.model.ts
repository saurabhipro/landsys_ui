export interface INoticeStatus {
  id?: number;
  status?: string | null;
}

export class NoticeStatus implements INoticeStatus {
  constructor(public id?: number, public status?: string | null) {}
}

export function getNoticeStatusIdentifier(noticeStatus: INoticeStatus): number | undefined {
  return noticeStatus.id;
}
