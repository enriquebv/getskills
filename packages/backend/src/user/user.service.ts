import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  demo(): string {
    return 'hola';
  }
}