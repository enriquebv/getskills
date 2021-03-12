import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthService, RequestSession } from './auth.service';

@Injectable()
export class AddSessionFromTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: RequestSession, res: Response, next: NextFunction) {
    if (req.cookies?.['gs.access'] !== undefined) {
      const token = req.cookies['gs.access'];
      const userId = this.authService.decodeToken(token).userId;

      if (!req.session) req.session = {};
      req.session.userId = userId as string;
    }

    next();
  }
}
