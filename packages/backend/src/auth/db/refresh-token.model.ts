import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel, SCHEMA_TIMESTAMP_CONFIG } from 'src/shared/base.model';

export type RefreshTokenDocument = RefreshTokenModel & Document;

@Schema({ collection: 'refresh_token', ...SCHEMA_TIMESTAMP_CONFIG })
export class RefreshTokenModel extends BaseModel {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  is_revoked: boolean
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenModel)