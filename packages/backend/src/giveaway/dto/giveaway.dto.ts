import { UserDto } from 'src/user/dto/user.dto';
import { GiveawayModelResolved } from '../db/giveaway.model';

interface UserInfo {
  id: string;
  user: string;
  name: string;
}

export default class GiveawayDto {
  id: string;
  title: string;
  description: string;
  author: UserDto;
  active: boolean;
  participants: UserInfo[];
  rewardInfo: {
    id: string;
    title: string;
    cost: number;
  };

  constructor(partial: Partial<GiveawayModelResolved>) {
    this.id = partial.id;
    this.title = partial.title;
    this.description = partial.description;
    this.author = new UserDto(partial.author);
    this.active = partial.active;
    this.rewardInfo = partial.rewardInfo;
    this.participants = partial.participants;
  }
}
