import { GiveawayModel } from '../db/giveaway.model';

type Participant = {
  id: string;
  user: string;
  name: string;
};

export default class ParticipantDto {
  id: string;
  user: string;
  name: string;

  constructor(partial: Partial<Participant>) {
    this.id = partial.id;
    this.user = partial.user;
    this.name = partial.name;
  }
}
