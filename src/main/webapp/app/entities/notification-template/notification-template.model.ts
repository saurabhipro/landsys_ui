export interface INotificationTemplate {
  id?: number;
  name?: string | null;
  templateText?: string | null;
  defaultUse?: boolean | null;
  fileContentType?: string | null;
  file?: string | null;
}

export class NotificationTemplate implements INotificationTemplate {
  constructor(
    public id?: number,
    public name?: string | null,
    public templateText?: string | null,
    public defaultUse?: boolean | null,
    public fileContentType?: string | null,
    public file?: string | null
  ) {
    this.defaultUse = this.defaultUse ?? false;
  }
}

export function getNotificationTemplateIdentifier(notificationTemplate: INotificationTemplate): number | undefined {
  return notificationTemplate.id;
}
