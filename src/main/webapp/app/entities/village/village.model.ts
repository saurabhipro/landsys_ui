import { ILand } from 'app/entities/land/land.model';
import { ISubDistrict } from 'app/entities/sub-district/sub-district.model';

export interface IVillage {
  id?: number;
  name?: string;
  lands?: ILand[] | null;
  subDistrict?: ISubDistrict;
}

export class Village implements IVillage {
  constructor(public id?: number, public name?: string, public lands?: ILand[] | null, public subDistrict?: ISubDistrict) {}
}

export function getVillageIdentifier(village: IVillage): number | undefined {
  return village.id;
}
