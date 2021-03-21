import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OnlyAuthorizedGuard } from 'src/auth/only-authorized.guard';
import { GetSession, Session } from 'src/auth/session.decorator';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(OnlyAuthorizedGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async me(@GetSession() session: Session): Promise<UserDto> {
    const user = await this.userService.getUser(session.userId);
    return new UserDto(user);
  }
}
