import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface Session {
  userId: string;
}

/**
 * Rest decorator for get auth user
 */
export const GetSession = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Session => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  },
);
