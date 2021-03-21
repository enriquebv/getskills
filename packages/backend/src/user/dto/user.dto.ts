import { UserModel } from '../db/user.model';

export class UserDto {
  id: string;
  user: string;
  username: string;
  avatar: string;

  constructor(partial: Partial<UserModel>) {
    this.id = partial.id;
    this.user = partial.user;
    this.username = partial.username;
    this.avatar = partial.twitch.avatar;
  }
}
