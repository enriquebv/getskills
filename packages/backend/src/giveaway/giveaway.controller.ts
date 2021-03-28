import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetSession, Session } from 'src/auth/session.decorator';
import CreateGiveawayDto from './dto/create-giveaway.dto';
import ParticipantDto from './dto/participant.dto';
import GiveawayDto from './dto/giveaway.dto';
import UpdateGiveawayDto from './dto/update-giveaway.dto';
import { GiveawayService } from './giveaway.service';
import { OnlyAuthorizedGuard } from 'src/auth/only-authorized.guard';

@Controller('/api/giveaway')
export class GiveawayController {
  constructor(private readonly giveawayService: GiveawayService) {}

  @Post()
  @UseGuards(OnlyAuthorizedGuard)
  async createPost(
    @Body() body: CreateGiveawayDto,
    @GetSession() session: Session,
  ) {
    const giveaway = await this.giveawayService.createGiveaway({
      ...body,
      author: session.userId,
    });

    return new GiveawayDto(giveaway);
  }

  @Patch('/:id')
  @UseGuards(OnlyAuthorizedGuard)
  async partialUdpatePost(
    @Param('id') id: string,
    @Body() body: UpdateGiveawayDto,
    @GetSession() session: Session,
  ) {
    const giveaway = await this.giveawayService.partialUpdateGiveaway(
      id,
      session.userId,
      body,
    );
    return new GiveawayDto(giveaway);
  }

  @Get('/author/twitch/:user')
  async getByTwitchAuthor(@Param('user') user: string) {
    const giveaway = await this.giveawayService.getGiveawayByTwitchAuthor(user);
    return new GiveawayDto(giveaway);
  }

  @Post('/cancel/:id')
  @UseGuards(OnlyAuthorizedGuard)
  async cancelGiveaway(
    @Param('id') id: string,
    @GetSession() session: Session,
  ) {
    await this.giveawayService.cancelGiveaway(id, session.userId);
  }

  @Post('/end/:id')
  @UseGuards(OnlyAuthorizedGuard)
  async endGiveaway(
    @Param('id') id: string,
    @GetSession() session: Session,
  ): Promise<ParticipantDto> {
    return new ParticipantDto(
      await this.giveawayService.pickWinnerAndEndGiveaway(id, session.userId),
    );
  }
}
