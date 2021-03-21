import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModel, UserTwitch } from './user.model';
import { BaseRepository } from 'src/shared/base.repository';

export interface CreateUserOptions {
  user: string;
  username: string;
  email: string;
  twitch?: UserTwitch;
}

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async createUser(options: CreateUserOptions): Promise<UserModel> {
    return this.userModel.create(options);
  }

  async getUserByTwitchId(id: string): Promise<UserModel> {
    return this.userModel.findOne({ 'twitch.id': id });
  }

  async updateTwitchAccessToken(id: string, accessToken) {
    return this.userModel.findByIdAndUpdate(id, {
      'twitch.accessToken': accessToken,
    });
  }

  async getByUser(user: string) {
    return this.userModel.findOne({ user });
  }
}
