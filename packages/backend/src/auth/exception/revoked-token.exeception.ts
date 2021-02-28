import { NotAcceptableException } from '@nestjs/common';

export class RevokedTokenException extends NotAcceptableException {
  constructor() {
    super('Refresh token is revoked.');
  }
}
