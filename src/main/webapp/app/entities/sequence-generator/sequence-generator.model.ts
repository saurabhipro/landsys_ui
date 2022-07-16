import { SequenceType } from 'app/entities/enumerations/sequence-type.model';

export interface ISequenceGenerator {
  id?: number;
  seqType?: SequenceType;
  latestSequence?: number;
  sequenceSuffix?: string;
}

export class SequenceGenerator implements ISequenceGenerator {
  constructor(public id?: number, public seqType?: SequenceType, public latestSequence?: number, public sequenceSuffix?: string) {}
}

export function getSequenceGeneratorIdentifier(sequenceGenerator: ISequenceGenerator): number | undefined {
  return sequenceGenerator.id;
}
