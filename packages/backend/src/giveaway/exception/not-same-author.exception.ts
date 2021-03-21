import { ForbiddenException } from '@nestjs/common';

export default class NotSameAuthorException extends ForbiddenException {
  constructor() {
    super('Not same giveaway author.');
  }
}
