import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose';
import { RefreshTokenRepository } from './db/refresh-token.repository';

export interface UserTokenPair {
  access: string
  refresh: string
  userId: string
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly refreshTokenRepository: RefreshTokenRepository) { }

  /**
   * Generate a new pair of refresh/access token for an user
   * @param userId string
   */
  async generateTokenPair(userId: string): Promise<UserTokenPair> {
    const storedRefreshToken = await this.refreshTokenRepository.createRefreshToken(userId);

    return {
      access: await this.jwtService.signAsync({}, {
        subject: userId,
        expiresIn: '1.5 hrs'
      }),
      refresh: await this.jwtService.signAsync({ rid: storedRefreshToken.id }, { subject: userId }),
      userId: userId
    }
  }

  /**
   * Revoke a refresh token from any type
   * @param refreshToken string
   */
  async revokeRefreshToken(refreshToken: string) {
    const { rid: refreshTokenId } = await this.jwtService.verifyAsync(refreshToken);
    await this.refreshTokenRepository.setRevoked(refreshTokenId, true);
  }

  /**
   * Take a refresh token and generates a new access token
   * @param refreshToken string
   */
  async refreshAccessToken(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken);
    const { rid: refreshTokenId, sub: userId } = payload;
    const storedRefreshToken = await this.refreshTokenRepository.getById(refreshTokenId);

    // TODO check if subject is the same as stored reference user

    if (storedRefreshToken.is_revoked) {
      throw new ForbiddenException('Refresh token is revoked.');
    }

    const access = await this.jwtService.signAsync({}, {
      subject: userId,
      expiresIn: '1.5 hrs'
    });

    return { access };
  }
}