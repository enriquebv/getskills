import { Injectable } from '@nestjs/common';
import { TwitchApiRepository } from 'src/twitch/twitch-api.repository';
import { TwitchService } from 'src/twitch/twitch.service';
import { UserRepository } from 'src/user/db/user.repository';
import { GiveawayModel, GiveawayModelResolved } from './db/giveaway.model';
import { GiveawayRepository } from './db/giveaway.repository';
import CreateGiveawayDto from './dto/create-giveaway.dto';
import ParticipantDto from './dto/participant.dto';
import UpdateGiveawayDto from './dto/update-giveaway.dto';
import { AuthorNotFoundException } from './exception/author-not-found.exception';
import CantUpdateInactiveGiveawayException from './exception/cant-update-inactive.exception';
import { GiveawayActiveException } from './exception/giveaway-active.exception';
import { GiveawayNotFoundException } from './exception/giveaway-not-found.exception';
import InvalidGiveawayType from './exception/invalid-giveaway-type.exception';
import NotSameAuthorException from './exception/not-same-author.exception';
import * as sanitize from 'sanitize-html';

interface CreateGiveawayOptionsInterface extends CreateGiveawayDto {
  author: string;
}

interface AddChannelPointsGiveawayParticipantOptions {
  broadcasterId: string;
  rewardId: string;
  userInfo: {
    id: string;
    user: string;
    name: string;
  };
}

@Injectable()
export class GiveawayService {
  constructor(
    private readonly giveawayRepository: GiveawayRepository,
    private readonly userRepository: UserRepository,
    private readonly twitchApiRepository: TwitchApiRepository,
    private readonly twitchService: TwitchService,
  ) {}

  async createGiveaway(
    options: CreateGiveawayOptionsInterface,
  ): Promise<GiveawayModelResolved> {
    const lastGiveaway = await this.giveawayRepository.getLastGiveawayByAuthor(
      options.author,
    );

    if (lastGiveaway && lastGiveaway.active) {
      throw new GiveawayActiveException();
    }

    switch (options.type) {
      case 'twitch:channel-points':
        return this.createChannelPointsGiveaway(options);
      default:
        throw new InvalidGiveawayType(options.type);
    }
  }

  async getGiveawayByTwitchAuthor(
    author: string,
  ): Promise<GiveawayModelResolved> {
    const user = await this.userRepository.getByUser(author);

    if (!user) {
      throw new AuthorNotFoundException();
    }

    const lastGiveaway = await this.giveawayRepository.getLastGiveawayByAuthor(
      user.id,
    );

    if (!lastGiveaway) {
      throw new GiveawayNotFoundException();
    }

    return lastGiveaway;
  }

  async partialUpdateGiveaway(
    id: string,
    updaterId: string,
    body: UpdateGiveawayDto,
  ) {
    const giveaway = await this.giveawayRepository.getById(id);
    const authorId = giveaway.author.toString();

    if (!giveaway) {
      throw new GiveawayNotFoundException();
    }

    if (authorId !== updaterId) {
      throw new NotSameAuthorException();
    }

    if (!giveaway.active) {
      throw new CantUpdateInactiveGiveawayException();
    }

    await this.giveawayRepository.updateById(id, body);

    return this.giveawayRepository.getResolvedById(id);
  }

  async cancelGiveaway(id: string, issuer: string) {
    const giveaway = await this.giveawayRepository.getById<GiveawayModel>(id);

    if (!giveaway) {
      throw new GiveawayNotFoundException();
    }

    if (giveaway.author.toString() !== issuer) {
      throw new NotSameAuthorException();
    }

    switch (giveaway.type) {
      case 'twitch:channel-points':
        return this.cancelChannelPointsGiveaway(giveaway);
      default:
        throw new InvalidGiveawayType(giveaway.type);
    }
  }

  async createChannelPointsGiveaway(options: CreateGiveawayOptionsInterface) {
    const user = await this.userRepository.getById(options.author);
    const { accessToken, id: twitchId } = user.twitch;

    const twitchAuth = {
      accessToken,
      twitchId,
    };
    const rewardOptions = {
      title: options.rewardTitle,
      cost: options.rewardCost,
      background_color: '#6441a5',
    };

    const reward = await this.twitchApiRepository.createCustomReward(
      twitchAuth,
      rewardOptions,
    );

    this.twitchService.createChannelPointsWebhook({
      twitchId,
      rewardId: reward.id,
    });

    options.description = sanitize(options.description);

    return this.giveawayRepository.createGiveaway({
      ...options,
      rewardInfo: {
        id: reward.id,
        title: options.rewardTitle,
        cost: options.rewardCost,
      },
    });
  }

  async cancelChannelPointsGiveaway(giveaway: GiveawayModel) {
    const user = await this.userRepository.getById(giveaway.author);
    const { accessToken, id: twitchId } = user.twitch;

    try {
      await this.twitchApiRepository.deleteCustomReward(
        {
          accessToken,
          twitchId,
        },
        giveaway.rewardInfo.id,
      );

      return this.giveawayRepository.updateById(giveaway.id, {
        active: false,
        reasonFinished: 'cancelled',
      });
    } catch (error) {
      // TODO Add option "force" to control error tolerance
      if (error.status === 404) {
        return this.giveawayRepository.updateById(giveaway.id, {
          active: false,
          reasonFinished: 'cancelled',
        });
      }

      throw error;
    }
  }

  async addChannelPointsGiveawayParticipant(
    options: AddChannelPointsGiveawayParticipantOptions,
  ) {
    const giveaway = await this.giveawayRepository.getGiveawayByRewardId(
      options.rewardId,
    );

    // TODO check silent errors and add it to a log view
    if (!giveaway) return;

    return this.giveawayRepository.addGiveawayRepository(
      giveaway.id,
      options.userInfo,
    );
  }

  async pickWinnerAndEndGiveaway(
    giveawayId: string,
    issuer: string,
  ): Promise<ParticipantDto> {
    const giveaway = await this.giveawayRepository.getResolvedById(giveawayId);

    if (giveaway.author.id !== issuer) {
      throw new NotSameAuthorException();
    }

    if (!giveaway.active) {
      throw new CantUpdateInactiveGiveawayException();
    }

    const { participants } = giveaway;
    const winner =
      participants[Math.floor(Math.random() * participants.length)];
    const user = await this.userRepository.getById(giveaway.author);
    const { accessToken, id: twitchId } = user.twitch;

    try {
      await this.twitchApiRepository.deleteCustomReward(
        {
          accessToken,
          twitchId,
        },
        giveaway.rewardInfo.id,
      );

      await this.giveawayRepository.updateById(giveaway.id, {
        active: false,
        reasonFinished: 'winner-picked',
        winner,
      });

      return winner;
    } catch (error) {
      // TODO Add option "force" to control error tolerance
      if (error.status === 404) {
        await this.giveawayRepository.updateById(giveaway.id, {
          active: false,
          reasonFinished: 'winner-picked',
          winner,
        });

        return winner;
      }

      throw error;
    }
  }
}
