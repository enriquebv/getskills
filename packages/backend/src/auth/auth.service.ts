import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenRepository } from './db/refresh-token.repository';
import { TwitchApiRepository } from 'src/shared/twitch-api.repository';
import { InvalidTwitchScopesException } from './exception/invalid-twitch-scopes.exception';
import { RevokedTokenException } from './exception/revoked-token.exeception';
import { InvalidTwitchTokenTypeException } from './exception/invalid-twitch-token-type.exception';
import { UserRepository } from 'src/user/db/user.repository';
import { Request } from 'express';

export interface RequestSession extends Request {
  session: {
    userId?: string;
  };
}

export interface UserTokenPair {
  access: string;
  refresh: string;
  userId: string;
}

export interface AuthWithTwitchArgs {
  twitchAccessToken: string;
  scopes: string[];
  type: string;
}

interface DecodedToken {
  [key: string]: string | number;
  exp: number;
}

const ACCESS_TOKEN_EXPIRATION = '1.5h';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly twitchApiRepository: TwitchApiRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Generate a new pair of refresh/access token for an user
   * @param userId string
   */
  async generateTokenPair(userId: string): Promise<UserTokenPair> {
    const storedRefreshToken = await this.refreshTokenRepository.createRefreshToken(
      userId,
    );

    const accessTokenOptions = {
      subject: userId,
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    };
    const refreshTokenOptions = { subject: userId };

    const access = await this.jwtService.signAsync(
      { userId },
      accessTokenOptions,
    );
    const refresh = await this.jwtService.signAsync(
      { rid: storedRefreshToken.id },
      refreshTokenOptions,
    );

    return { access, refresh, userId };
  }

  /**
   * Revoke a refresh token from any type
   * @param refreshToken string
   */
  async revokeRefreshToken(refreshToken: string) {
    const { rid: refreshTokenId } = await this.jwtService.verifyAsync(
      refreshToken,
    );
    await this.refreshTokenRepository.setRevoked(refreshTokenId, true);
  }

  /**
   * Take a refresh token and generates a new access token
   * @param refreshToken string
   */
  async refreshAccessToken(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken);
    const { rid: refreshTokenId, sub: userId } = payload;
    const storedRefreshToken = await this.refreshTokenRepository.getById(
      refreshTokenId,
    );

    // TODO check if subject is the same as stored reference user

    if (storedRefreshToken.is_revoked) {
      throw new RevokedTokenException();
    }

    const accessTokenOptions = {
      subject: userId,
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    };

    const access = await this.jwtService.signAsync(
      { userId },
      accessTokenOptions,
    );

    return { access };
  }

  async authWithTwitch({
    twitchAccessToken,
    scopes,
    type,
  }: AuthWithTwitchArgs): Promise<UserTokenPair> {
    if (
      !scopes.includes('user:read:email') ||
      !scopes.includes('channel:manage:redemptions')
    ) {
      throw new InvalidTwitchScopesException(scopes);
    }

    if (type !== 'bearer') {
      throw new InvalidTwitchTokenTypeException(type);
    }

    const twitchUser = await this.twitchApiRepository.getUser({
      accessToken: twitchAccessToken,
    });

    let storedUser = await this.userRepository.getUserByTwitchId(twitchUser.id);

    // If user is not registered, create it
    if (!storedUser) {
      storedUser = await this.userRepository.createUser({
        username: twitchUser.display_name,
        email: twitchUser.email,
        twitch: {
          user: twitchUser.login,
          username: twitchUser.display_name,
          email: twitchUser.email,
          avatar: twitchUser.profile_image_url,
          accessToken: twitchAccessToken,
          id: twitchUser.id,
        },
      });
    }

    // If access token is new, update it
    if (storedUser.twitch.accessToken !== twitchAccessToken) {
      await this.userRepository.updateTwitchAccessToken(
        storedUser.id,
        twitchAccessToken,
      );
    }

    return this.generateTokenPair(storedUser.id);
  }

  decodeToken(token: string): DecodedToken {
    return this.jwtService.decode(token) as DecodedToken;
  }

  verifyToken(token: string): Promise<DecodedToken> {
    return this.jwtService.verifyAsync(token) as Promise<DecodedToken>;
  }
}
