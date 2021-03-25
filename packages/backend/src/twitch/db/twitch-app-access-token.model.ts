import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseModel, SCHEMA_TIMESTAMP_CONFIG } from 'src/shared/base.model';

export type TwitchAppAccessTokensDocument = TwitchAppAccessTokenModel &
  mongoose.Document;

@Schema({ collection: 'twitch_app_access_tokens', ...SCHEMA_TIMESTAMP_CONFIG })
export class TwitchAppAccessTokenModel extends BaseModel {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresIn: number;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  scopes: string[];

  @Prop({ required: true })
  type: string;

  @Prop({ required: false, default: false })
  revoked: boolean;
}

export const TwitchAppAccessTokensSchema = SchemaFactory.createForClass(
  TwitchAppAccessTokenModel,
);
