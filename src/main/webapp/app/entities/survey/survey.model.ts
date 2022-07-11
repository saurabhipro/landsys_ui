import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { SurveyStatus } from 'app/entities/enumerations/survey-status.model';

export interface ISurvey {
  id?: number;
  surveyor?: string;
  hissaType?: HissaType;
  sharePercentage?: number;
  area?: number;
  landMarketValue?: number;
  structuralValue?: number | null;
  horticultureValue?: number | null;
  forestValue?: number | null;
  distanceFromCity?: number | null;
  remarks?: string | null;
  status?: SurveyStatus | null;
  khatedar?: IKhatedar | null;
  projectLand?: IProjectLand;
  landCompensations?: ILandCompensation[] | null;
}

export class Survey implements ISurvey {
  constructor(
    public id?: number,
    public surveyor?: string,
    public hissaType?: HissaType,
    public sharePercentage?: number,
    public area?: number,
    public landMarketValue?: number,
    public structuralValue?: number | null,
    public horticultureValue?: number | null,
    public forestValue?: number | null,
    public distanceFromCity?: number | null,
    public remarks?: string | null,
    public status?: SurveyStatus | null,
    public khatedar?: IKhatedar | null,
    public projectLand?: IProjectLand,
    public landCompensations?: ILandCompensation[] | null
  ) {}
}

export function getSurveyIdentifier(survey: ISurvey): number | undefined {
  return survey.id;
}
