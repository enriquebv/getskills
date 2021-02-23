import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  getUser(): void {
    throw new Error('el body esta mal chacho')
  }
}