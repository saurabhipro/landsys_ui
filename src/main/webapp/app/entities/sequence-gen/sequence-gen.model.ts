import { SequenceType } from 'app/entities/enumerations/sequence-type.model';

export interface ISequenceGen {
  id?: number;
  seqType?: SequenceType;
  latestSequence?: number;
  sequenceSuffix?: string;
}

export class SequenceGen implements ISequenceGen {
  constructor(public id?: number, public seqType?: SequenceType, public latestSequence?: number, public sequenceSuffix?: string) {}
}

export function getSequenceGenIdentifier(sequenceGen: ISequenceGen): number | undefined {
  return sequenceGen.id;
}
