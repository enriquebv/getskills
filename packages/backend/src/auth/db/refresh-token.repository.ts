import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshTokenDocument, RefreshTokenModel } from './refresh-token.model';
import { BaseRepository } from 'src/shared/base.repository'

@Injectable()
export class RefreshTokenRepository extends BaseRepository {
  constructor(@InjectModel(RefreshTokenModel.name) private refreshTokenModel: Model<RefreshTokenDocument>) {
    super(refreshTokenModel);
  }

  async createRefreshToken(userId): Promise<RefreshTokenDocument> {
    const token = new this.refreshTokenModel({
      user_id: userId,
      is_revoked: false
    });
    return token.save();
  }

  async setRevoked(refreshTokenId, revokedStatus): Promise<RefreshTokenDocument> {
    const token = await this.getById(refreshTokenId);

    token.is_revoked = revokedStatus;

    return token.save();
  }
}