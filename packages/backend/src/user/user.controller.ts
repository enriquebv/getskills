import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OnlyAuthorizedGuard } from 'src/auth/only-authorized.guard';
import { GetSession, Session } from 'src/auth/session.decorator';
import { TwitchApiRepository } from 'src/shared/twitch-api.repository';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly twitchApiRepository: TwitchApiRepository,
  ) {}

  @Get()
  @UseGuards(OnlyAuthorizedGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async me(@GetSession() session: Session): Promise<UserDto> {
    const user = await this.userService.getUser(session.userId);
    return new UserDto(user);
  }

  @Get('/stats')
  @UseGuards(OnlyAuthorizedGuard)
  async stats(@GetSession() session: Session): Promise<any> {
    const user = await this.userService.getUser(session.userId);
    const rewards = await this.twitchApiRepository.getChannelPointsRewards({
      accessToken: user.twitch.accessToken,
      twitchId: user.twitch.id,
    });
    const redemptions = await this.twitchApiRepository.getChannelPointsRedemptions(
      {
        accessToken: user.twitch.accessToken,
        twitchId: user.twitch.id,
        rewardId: rewards[0].id,
      },
    );
    return { rewards, redemptions };
  }
}
