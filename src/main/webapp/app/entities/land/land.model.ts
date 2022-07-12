import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { IVillage } from 'app/entities/village/village.model';
import { IUnit } from 'app/entities/unit/unit.model';
import { ILandType } from 'app/entities/land-type/land-type.model';
import { IState } from 'app/entities/state/state.model';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { IProject } from 'app/entities/project/project.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';

export interface ILand {
  id?: number;
  ulpin?: string | null;
  khasraNumber?: string;
  kahtauniKhata?: string | null;
  area?: number | null;
  landMarketValue?: number | null;
  structuralValue?: number | null;
  horticultureValue?: number | null;
  forestValue?: number | null;
  distanceFromCity?: string | null;
  totalLandValue?: number | null;
  paymentAdvices?: IPaymentAdvice[] | null;
  village?: IVillage;
  unit?: IUnit;
  landType?: ILandType;
  state?: IState;
  citizen?: ICitizen | null;
  project?: IProject | null;
  projectLands?: IProjectLand[];
}

export class Land implements ILand {
  constructor(
    public id?: number,
    public ulpin?: string | null,
    public khasraNumber?: string,
    public kahtauniKhata?: string | null,
    public area?: number | null,
    public landMarketValue?: number | null,
    public structuralValue?: number | null,
    public horticultureValue?: number | null,
    public forestValue?: number | null,
    public distanceFromCity?: string | null,
    public totalLandValue?: number | null,
    public paymentAdvices?: IPaymentAdvice[] | null,
    public village?: IVillage,
    public unit?: IUnit,
    public landType?: ILandType,
    public state?: IState,
    public citizen?: ICitizen | null,
    public project?: IProject | null,
    public projectLands?: IProjectLand[]
  ) {}
}

export function getLandIdentifier(land: ILand): number | undefined {
  return land.id;
}
