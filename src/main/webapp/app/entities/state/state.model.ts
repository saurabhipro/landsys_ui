import { IDistrict } from 'app/entities/district/district.model';
import { ILand } from 'app/entities/land/land.model';

export interface IState {
  id?: number;
  name?: string;
  district?: IDistrict;
  land?: ILand;
}

export class State implements IState {
  constructor(public id?: number, public name?: string, public district?: IDistrict, public land?: ILand) {}
}

export function getStateIdentifier(state: IState): number | undefined {
  return state.id;
}
