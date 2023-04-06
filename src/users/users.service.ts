import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (!user || !follower) {
      throw new NotFoundException({
        is_success: false,
        message: 'The follower/followee is not found',
      });
    }

    const isUserFollowed = await this.followRepository.findOne({
      where: {
        follower: {
          id: followerId,
        },
        followee: {
          id: id,
        },
      },
    });
    if (isUserFollowed) {
      throw new BadRequestException({
        is_success: false,
        message: 'the user is already followed this peer',
      });
    }
    const payload = {
      follower,
      followee: user,
    };
    const followeInstance = this.followRepository.create(payload);
    return await this.followRepository.save(followeInstance);
  }

  async unfollowUser(currentUserId: number, followerId: number) {
    const isFollower = await this.followRepository.findOne({
      where: {
        followee: {
          id: currentUserId,
        },
        follower: {
          id: followerId,
        },
      },
    });
    if (!isFollower) {
      throw new NotFoundException({
        is_success: false,
        message: 'This peer is not followed by current user',
      });
    }
    await this.followRepository.softDelete(isFollower.id);
  }

  async getFollowers(userId: number) {
    const [followers, totalcount] = await this.followRepository.findAndCount({
      where: {
        follower: {
          id: userId,
        },
      },
      relations: ['follower'],
    });
    return { followers, totalcount };
  }

  async getFollowees(userId: number) {
    const [followees, totalcount] = await this.followRepository.findAndCount({
      where: {
        followee: {
          id: userId,
        },
      },
      relations: ['follower'],
    });
    return { followees, totalcount };
  }
}
