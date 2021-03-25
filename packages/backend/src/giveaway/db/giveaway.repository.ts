import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GiveawayDocument,
  GiveawayModel,
  GiveawayModelResolved,
} from './giveaway.model';
import { BaseRepository } from 'src/shared/base.repository';

interface CreateGivewayOptionsInterface {
  title: string;
  description: string;
  author: string;
  type: string;
  rewardInfo: {
    id: string;
    title: string;
    cost: number;
  };
}

interface AddGiveawayParticipantOptions {
  id: string;
  user: string;
  name: string;
}

@Injectable()
export class GiveawayRepository extends BaseRepository {
  constructor(
    @InjectModel(GiveawayModel.name)
    private giveawayModel: Model<GiveawayDocument>,
  ) {
    super(giveawayModel);
  }

  async createGiveaway({
    title,
    description,
    author,
    type,
    rewardInfo,
  }: CreateGivewayOptionsInterface): Promise<GiveawayModelResolved> {
    const giveaway = await this.giveawayModel.create({
      title,
      description,
      author,
      type,
      rewardInfo,
    });
    return (giveaway
      .populate('author')
      .execPopulate() as unknown) as GiveawayModelResolved;
  }

  async getLastGiveawayByAuthor(
    author: string,
  ): Promise<GiveawayModelResolved> {
    const giveaway = await this.giveawayModel.findOne({ author }, null, {
      sort: { created_at: 'desc' },
    });

    if (!giveaway) {
      return null;
    }

    return (giveaway
      .populate('author')
      .execPopulate() as unknown) as GiveawayModelResolved;
  }

  async getResolvedById(id: string): Promise<GiveawayModelResolved> {
    const giveaway = await this.giveawayModel.findById(id);

    if (!giveaway) {
      return null;
    }

    return (giveaway
      .populate('author')
      .execPopulate() as unknown) as GiveawayModelResolved;
  }

  async getGiveawayByRewardId(rewardId: string) {
    return this.giveawayModel.findOne({ 'rewardInfo.id': rewardId });
  }

  async addGiveawayRepository(
    id: string,
    participantInfo: AddGiveawayParticipantOptions,
  ) {
    await this.giveawayModel.findByIdAndUpdate(id, {
      $push: { participants: participantInfo },
    });

    return this.getResolvedById(id);
  }
}
