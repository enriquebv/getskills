import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  getUser(@Body() body: RegisterUserDto): void {
    throw new Error('el body esta mal chacho')
  }
}