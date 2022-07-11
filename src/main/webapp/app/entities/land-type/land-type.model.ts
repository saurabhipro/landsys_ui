import { ILand } from 'app/entities/land/land.model';

export interface ILandType {
  id?: number;
  name?: string;
  description?: string;
  lands?: ILand[];
}

export class LandType implements ILandType {
  constructor(public id?: number, public name?: string, public description?: string, public lands?: ILand[]) {}
}

export function getLandTypeIdentifier(landType: ILandType): number | undefined {
  return landType.id;
}
