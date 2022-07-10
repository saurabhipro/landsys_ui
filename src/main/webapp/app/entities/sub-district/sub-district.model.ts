import { IVillage } from 'app/entities/village/village.model';
import { IDistrict } from 'app/entities/district/district.model';

export interface ISubDistrict {
  id?: number;
  name?: string;
  villages?: IVillage[] | null;
  district?: IDistrict;
}

export class SubDistrict implements ISubDistrict {
  constructor(public id?: number, public name?: string, public villages?: IVillage[] | null, public district?: IDistrict) {}
}

export function getSubDistrictIdentifier(subDistrict: ISubDistrict): number | undefined {
  return subDistrict.id;
}
