import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthService, RequestSession } from './auth.service';

@Injectable()
export class JwtSessionMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: RequestSession, res: Response, next: NextFunction) {
    if (req.cookies?.['gs.access'] !== undefined) {
      // process.env.APP_DEBUG === 'true' && console.info('Tokens existen');
      const token = req.cookies['gs.access'];

      const userId = this.authService.decodeToken(token).userId;

      if (!req.session) req.session = {};
      req.session.userId = userId as string;
    }

    next();
  }
}
