import { IVillage } from 'app/entities/village/village.model';
import { IUnit } from 'app/entities/unit/unit.model';
import { ILandType } from 'app/entities/land-type/land-type.model';
import { IState } from 'app/entities/state/state.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { IDistrict } from '../district/district.model';

export interface ILand {
  id?: number;
  ulpin?: string | null;
  khasraNumber?: string;
  khatauni?: string | null;
  area?: number | null;
  landMarketValue?: number | null;
  structuralValue?: number | null;
  horticultureValue?: number | null;
  forestValue?: number | null;
  distanceFromCity?: string | null;
  totalLandValue?: number | null;
  village?: IVillage;
  unit?: IUnit;
  landType?: ILandType;
  district?: IDistrict;
  state?: IState;
  projectLands?: IProjectLand[] | null;
}

export class Land implements ILand {
  constructor(
    public id?: number,
    public ulpin?: string | null,
    public khasraNumber?: string,
    public khatauni?: string | null,
    public area?: number | null,
    public landMarketValue?: number | null,
    public structuralValue?: number | null,
    public horticultureValue?: number | null,
    public forestValue?: number | null,
    public distanceFromCity?: string | null,
    public totalLandValue?: number | null,
    public village?: IVillage,
    public unit?: IUnit,
    public landType?: ILandType,
    district?: IDistrict,
    state?: IState,
    public projectLands?: IProjectLand[] | null
  ) {}
}

export function getLandIdentifier(land: ILand): number | undefined {
  return land.id;
}
