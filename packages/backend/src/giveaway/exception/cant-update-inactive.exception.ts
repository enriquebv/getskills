import { ForbiddenException } from '@nestjs/common';

export default class CantUpdateInactiveGiveawayException extends ForbiddenException {
  constructor() {
    super("Can't update inactive giveaways.");
  }
}
