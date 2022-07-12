import { IDistrict } from 'app/entities/district/district.model';
import { ILand } from 'app/entities/land/land.model';

export interface IState {
  id?: number;
  name?: string;
  districts?: IDistrict[] | null;
  lands?: ILand[] | null;
}

export class State implements IState {
  constructor(public id?: number, public name?: string, public districts?: IDistrict[] | null, public lands?: ILand[] | null) {}
}

export function getStateIdentifier(state: IState): number | undefined {
  return state.id;
}
