import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseModel, SCHEMA_TIMESTAMP_CONFIG } from 'src/shared/base.model';

export type TwitchWebhookEventDocument = TwitchWebhookEventModel &
  mongoose.Document;

@Schema({ collection: 'twitch_webhook_events', ...SCHEMA_TIMESTAMP_CONFIG })
export class TwitchWebhookEventModel extends BaseModel {
  @Prop({ required: true })
  eventId: string;
}

export const TwitchWebhookEventSchema = SchemaFactory.createForClass(
  TwitchWebhookEventModel,
);
