import { NotAcceptableException } from "@nestjs/common";

export class ForbiddenException extends NotAcceptableException {
  constructor() {
    super('Refresh token is revoked.')
  }
}