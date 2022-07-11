import { IDistrict } from 'app/entities/district/district.model';
import { IVillage } from 'app/entities/village/village.model';

export interface ISubDistrict {
  id?: number;
  name?: string;
  district?: IDistrict | null;
  villages?: IVillage[];
}

export class SubDistrict implements ISubDistrict {
  constructor(public id?: number, public name?: string, public district?: IDistrict | null, public villages?: IVillage[]) {}
}

export function getSubDistrictIdentifier(subDistrict: ISubDistrict): number | undefined {
  return subDistrict.id;
}
