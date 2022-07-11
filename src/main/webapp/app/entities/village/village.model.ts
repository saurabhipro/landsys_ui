import { ISubDistrict } from 'app/entities/sub-district/sub-district.model';
import { ILand } from 'app/entities/land/land.model';

export interface IVillage {
  id?: number;
  name?: string;
  subDistrict?: ISubDistrict | null;
  lands?: ILand[];
}

export class Village implements IVillage {
  constructor(public id?: number, public name?: string, public subDistrict?: ISubDistrict | null, public lands?: ILand[]) {}
}

export function getVillageIdentifier(village: IVillage): number | undefined {
  return village.id;
}
