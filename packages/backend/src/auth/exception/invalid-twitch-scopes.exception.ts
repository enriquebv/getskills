import { BadRequestException } from '@nestjs/common';

export class InvalidTwitchScopesException extends BadRequestException {
  constructor(scopes: string[]) {
    super(`Invalid scopes provided: ${scopes.join(', ')}`);
  }
}
