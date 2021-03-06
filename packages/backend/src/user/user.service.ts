import { Injectable } from '@nestjs/common';
import { UserModel } from './db/user.model';
import { UserRepository } from './db/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(id: string): Promise<UserModel> {
    return this.userRepository.getById(id);
  }
}
