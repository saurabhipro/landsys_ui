export interface IForm11 {
  id?: number;
  projectName?: string | null;
  district?: string | null;
  subDistrict?: string | null;
  village?: string | null;
}

export class Form11 implements IForm11 {
  constructor(
    public id?: number,
    public projectName?: string | null,
    public district?: string | null,
    public subDistrict?: string | null,
    public village?: string | null
  ) {}
}

export function getForm11Identifier(form11: IForm11): number | undefined {
  return form11.id;
}
