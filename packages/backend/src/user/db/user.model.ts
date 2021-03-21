import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel, SCHEMA_TIMESTAMP_CONFIG } from 'src/shared/base.model';

export type UserDocument = UserModel & Document;

export interface UserTwitch {
  username: string;
  user: string;
  avatar: string;
  email: string;
  id: string;
  accessToken: string;
}

@Schema({ collection: 'user', ...SCHEMA_TIMESTAMP_CONFIG })
export class UserModel extends BaseModel {
  @Prop({ required: true, unique: true })
  user: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, type: 'Mixed' })
  twitch: UserTwitch;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
