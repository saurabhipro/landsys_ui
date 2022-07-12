import { IState } from 'app/entities/state/state.model';
import { ISubDistrict } from 'app/entities/sub-district/sub-district.model';

export interface IDistrict {
  id?: number;
  name?: string;
  state?: IState;
  subDistricts?: ISubDistrict[] | null;
}

export class District implements IDistrict {
  constructor(public id?: number, public name?: string, public state?: IState, public subDistricts?: ISubDistrict[] | null) {}
}

export function getDistrictIdentifier(district: IDistrict): number | undefined {
  return district.id;
}
