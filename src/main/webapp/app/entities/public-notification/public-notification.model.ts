import dayjs from 'dayjs/esm';

export interface IPublicNotification {
  id?: number;
  date?: dayjs.Dayjs | null;
  fileContentType?: string | null;
  file?: string | null;
}

export class PublicNotification implements IPublicNotification {
  constructor(public id?: number, public date?: dayjs.Dayjs | null, public fileContentType?: string | null, public file?: string | null) {}
}

export function getPublicNotificationIdentifier(publicNotification: IPublicNotification): number | undefined {
  return publicNotification.id;
}
