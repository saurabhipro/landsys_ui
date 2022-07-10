import { ILand } from 'app/entities/land/land.model';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { ISurvey } from 'app/entities/survey/survey.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { IProject } from 'app/entities/project/project.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';

export interface IProjectLand {
  id?: number;
  remarks?: string | null;
  documentsContentType?: string | null;
  documents?: string | null;
  hissaType?: HissaType | null;
  land?: ILand;
  khatedars?: IKhatedar[] | null;
  surveys?: ISurvey[] | null;
  landCompensations?: ILandCompensation[] | null;
  paymentAdvices?: IPaymentAdvice[];
  project?: IProject;
}

export class ProjectLand implements IProjectLand {
  constructor(
    public id?: number,
    public remarks?: string | null,
    public documentsContentType?: string | null,
    public documents?: string | null,
    public hissaType?: HissaType | null,
    public land?: ILand,
    public khatedars?: IKhatedar[] | null,
    public surveys?: ISurvey[] | null,
    public landCompensations?: ILandCompensation[] | null,
    public paymentAdvices?: IPaymentAdvice[],
    public project?: IProject
  ) {}
}

export function getProjectLandIdentifier(projectLand: IProjectLand): number | undefined {
  return projectLand.id;
}
