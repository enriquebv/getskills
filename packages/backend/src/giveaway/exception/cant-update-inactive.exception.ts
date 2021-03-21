import { ForbiddenException } from '@nestjs/common';

export default class CantUpdateInactiveException extends ForbiddenException {
  constructor() {
    super("Can't update inactive giveaways.");
  }
}
