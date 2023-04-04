import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './following.entity';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
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

  async find() {
    return await this.userRepository.find();
  }

  async findByName(name: string) {
    return await this.userRepository.findOneBy({ name });
  }

  async findUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, body: any) {
    const isUserExists = await this.findUserById(id);
    if (!isUserExists) {
      throw new NotFoundException({
        is_success: false,
        message: 'User not found',
      });
    }
    const user = await this.userRepository.update(id, body);
    return await this.findUserById(id);
  }

  async createRelation(id: number, followerId: number) {
    const user = await this.findUserById(id);
    const follower = await this.findUserById(followerId);
    const payload = {
      user: user,
      users: follower,
    };
    const followeInstance = this.followRepository.create(payload);
    return await this.followRepository.save(followeInstance);
  }
}
