import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repository';

import { User } from '../schemas';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(userId: string): Promise<User> {
    return this.usersRepository.findOne({ userId });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async getUserByParams(params: Partial<User>): Promise<User> {
    return this.usersRepository.findOne(params);
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async createUser(user: User): Promise<User> {
    return this.usersRepository.create(user);
  }

  async updateUser(_id: string, userUpdates): Promise<User> {
    return this.usersRepository.findOneAndUpdate({ _id }, userUpdates);
  }
}
