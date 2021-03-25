import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseModel, SCHEMA_TIMESTAMP_CONFIG } from 'src/shared/base.model';
import { UserModel } from 'src/user/db/user.model';

export type GiveawayDocument = GiveawayModel & mongoose.Document;

export type GiveawayModelResolved = GiveawayModel & {
  author: UserModel;
};

@Schema({ collection: 'giveaway', ...SCHEMA_TIMESTAMP_CONFIG })
export class GiveawayModel extends BaseModel {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [mongoose.Schema.Types.Mixed], default: [] })
  participants: {
    id: string;
    user: string;
    name: string;
  }[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel.name,
  })
  author: string;

  @Prop({ required: true })
  type: 'twitch:channel-points' | 'twitch:bits';

  @Prop({ required: false, default: true })
  active: boolean;

  @Prop({ required: false })
  reasonFinished: 'cancelled' | 'ended';

  @Prop({ required: false })
  reward: string;

  /**
   * TODO Change to specific model when future "channel-points-reward" module will be needed and apply a reference to that model.
   */
  @Prop({ required: false, type: mongoose.Schema.Types.Mixed })
  rewardInfo: {
    id: string;
    title: string;
    cost: number;
  };
}

export const GiveawaySchema = SchemaFactory.createForClass(GiveawayModel);
