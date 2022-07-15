import dayjs from 'dayjs/esm';

export interface IPublicNotification {
  id?: number;
  date?: dayjs.Dayjs;
  fileContentType?: string | null;
  file?: string | null;
  description?: string;
}

export class PublicNotification implements IPublicNotification {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public fileContentType?: string | null,
    public file?: string | null,
    public description?: string
  ) {}
}

export function getPublicNotificationIdentifier(publicNotification: IPublicNotification): number | undefined {
  return publicNotification.id;
}
