import { BadRequestException } from '@nestjs/common';

export default class InvalidGiveawayType extends BadRequestException {
  constructor(type: string) {
    super(`Invalid giveaway type "${type}".`);
  }
}
