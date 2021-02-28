import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService, RequestSession } from './auth.service';
import { TokenDto } from './dto/token.dto';
import { TwitchParamsDto } from './dto/twitch-params.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/twitch')
  async authWithTwitch(@Body() body: TwitchParamsDto, @Res() res: Response) {
    const tokens = await this.authService.authWithTwitch({
      twitchAccessToken: body.access_token,
      scopes: body.scopes,
      type: body.token_type,
    });

    if (!body.browser) {
      return tokens;
    }

    const { APP_ENV, ALLOWED_COOKIE_DOMAIN } = process.env;

    const cookieOptions = {
      httpOnly: true,
      path: '/',
      domain: ALLOWED_COOKIE_DOMAIN,
      secure: APP_ENV === 'production',
    };

    res
      .cookie('gs.access', tokens.access, cookieOptions)
      .cookie('gs.refresh', tokens.refresh, cookieOptions)
      .send(tokens);
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
