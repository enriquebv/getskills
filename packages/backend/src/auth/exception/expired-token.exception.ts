import { UnauthorizedException } from '@nestjs/common';

export class ExpiredTokenException extends UnauthorizedException {
  constructor() {
    super('Access token provided is expired.');
  }
}
