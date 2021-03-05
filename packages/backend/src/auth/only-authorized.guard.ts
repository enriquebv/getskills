import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthService, RequestSession } from './auth.service';
import { WithoutTokenException } from './exception/without-token.exception';
import { Response } from 'express';

@Injectable()
export class OnlyAuthorizedGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest() as RequestSession;
    const res = context.switchToHttp().getResponse() as Response;

    if (!req.cookies?.['gs.access'] || !req.cookies?.['gs.refresh']) {
      throw new WithoutTokenException();
    }

    const access = req.cookies['gs.access'];
    const refresh = req.cookies['gs.refresh'];

    try {
      await this.authService.verifyToken(access);
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const { access } = await this.authService.refreshAccessToken(refresh);
        res.cookie('gs.access', access);
        return true;
      }

      throw error;
    }
  }
}
