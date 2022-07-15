import { ISubDistrict } from 'app/entities/sub-district/sub-district.model';
import { ILand } from 'app/entities/land/land.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';

export interface IVillage {
  id?: number;
  name?: string;
  subDistrict?: ISubDistrict;
  lands?: ILand[] | null;
  surveys?: ISurvey[] | null;
  landCompensations?: ILandCompensation[] | null;
  projectLands?: IProjectLand[] | null;
}

export class Village implements IVillage {
  constructor(
    public id?: number,
    public name?: string,
    public subDistrict?: ISubDistrict,
    public lands?: ILand[] | null,
    public surveys?: ISurvey[] | null,
    public landCompensations?: ILandCompensation[] | null,
    public projectLands?: IProjectLand[] | null
  ) {}
}

export function getVillageIdentifier(village: IVillage): number | undefined {
  return village.id;
}
