import { Controller, Post, Body } from '@nestjs/common';
import { TwitchApiRepository } from 'src/shared/twitch-api.repository';
import { AuthService } from './auth.service';
import { TokenDto } from './dto/token.dto';
import { TwitchParamsDto } from './dto/twitch-params.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly twitchApiRepository: TwitchApiRepository) { }

  @Post('/twitch')
  async authWithTwitch(@Body() body: TwitchParamsDto) {
    const twitchUser = await this.twitchApiRepository.getUser({ accessToken: body.access_token })

    // generar usuario si no existe en back-end
    // generar par de tokens
    // devolver tokens
  }

  @Post('/refresh')
  async refresh(@Body() body: TokenDto) {
    return this.authService.refreshAccessToken(body.token);
  }

  @Post('/revoke')
  async revoke(@Body() body: TokenDto) {
    this.authService.revokeRefreshToken(body.token);
  }
}