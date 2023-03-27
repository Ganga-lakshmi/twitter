import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}
  async create(_userParams: Partial<Users>) {
    const userInstance = await this.userRepository.create(_userParams);
    const user = await this.userRepository.save(userInstance);
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }
}
