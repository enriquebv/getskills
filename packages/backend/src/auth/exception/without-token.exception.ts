import { BadRequestException } from '@nestjs/common';

export class WithoutTokenException extends BadRequestException {
  constructor() {
    super('Needed gs.access cookie/header.');
  }
}
