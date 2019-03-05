import { ParticipantRelationship } from './participantRelationship';

export class Participant {
  id?: number;
  user_id: number;
  relationship: String;
  last_updated?: Date;
  percent_complete?: number;
  num_studies_enrolled?: number;
  avatar_img_url?: string;
  name?: string;
  color?: string;
  icon?: string;

  constructor(private _props) {
    for (const propName in this._props) {
      if (this._props.hasOwnProperty(propName)) {
        this[propName] = this._props[propName];
      }
    }
  }

  getFlowName(): string {
    switch (this.relationship) {
      case ParticipantRelationship.DEPENDENT:
        return 'dependent_intake';
      case ParticipantRelationship.SELF_GUARDIAN:
        return 'guardian_intake';
      case ParticipantRelationship.SELF_PARTICIPANT:
        return 'self_intake';
      default:
        return 'self_intake';
    }
  }
}
