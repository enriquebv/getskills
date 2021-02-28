import { BadRequestException } from '@nestjs/common';

export class InvalidTwitchTokenTypeException extends BadRequestException {
  constructor(type: string) {
    super(`Invalid Twitch token type provided: ${type}`);
  }
}
