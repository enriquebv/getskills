import { BadRequestException } from '@nestjs/common';

export class GiveawayActiveException extends BadRequestException {
  constructor() {
    super(`Can't create more giveaways.`);
  }
}
