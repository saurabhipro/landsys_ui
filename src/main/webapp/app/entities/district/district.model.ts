import { ISubDistrict } from 'app/entities/sub-district/sub-district.model';
import { IState } from 'app/entities/state/state.model';

export interface IDistrict {
  id?: number;
  name?: string;
  subDistricts?: ISubDistrict[] | null;
  state?: IState;
}

export class District implements IDistrict {
  constructor(public id?: number, public name?: string, public subDistricts?: ISubDistrict[] | null, public state?: IState) {}
}

export function getDistrictIdentifier(district: IDistrict): number | undefined {
  return district.id;
}
