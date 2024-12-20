import { Injectable, Logger, LoggerService } from '@nestjs/common';

import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entity/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger: LoggerService = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async findOneByChatId(chatId: User['chatId']): Promise<User> {
    this.logger.log(`Trying to user info by chatId: ${chatId}`);

    const existingUser = await this.usersRepository.findOneByChatId(chatId);

    if (!existingUser) {
      this.logger.debug(`user with chatId: ${chatId} not found`);
      return;
    }

    this.logger.debug(`user successfully get by chatId: ${chatId}`);

    return existingUser;
  }

  async createUser({ chatId }: CreateUserDto): Promise<User> {
    this.logger.log(`Trying to create user ${chatId}`);

    const user = await this.usersRepository.findOneByChatId(chatId);

    if (user) {
      this.logger.error(`user with chatId ${chatId} already exists`);
      return;
    }

    const { raw } = await this.usersRepository.createUser({ chatId });

    this.logger.debug(`user successfully created with with id: ${raw[0].id}`);

    return raw[0].id;
  }
}
