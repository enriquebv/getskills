import { NotFoundException } from '@nestjs/common';

export class GiveawayNotFoundException extends NotFoundException {
  constructor() {
    super(`Giveway not found.`);
  }
}
