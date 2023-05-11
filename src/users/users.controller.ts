import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request
} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {Features} from 'src/auth/decorator/role.decorator';
import {UsersService} from 'src/users/users.service';
import {RequiredPermission} from './../utils/constants';
import {UpdateUserDto} from './dto/createuser.dto';
import {GetUsersListSchema} from './response.schema';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private userService: UsersService) {}

  @Features(RequiredPermission.Users)
  @Get('/followers-list')
  async followersCount(@Request() req) {
    const followersCount = await this.userService.getFollowers(req.user.id);
    return {
      is_success: true,
      message: 'Successfully fetched the followers',
      followersCount,
    };
  }

  @Features(RequiredPermission.Users)
  @Get('/followee-list')
  async followeeCount(@Request() req) {
    const followees = await this.userService.getFollowees(req.user.id);
    return {
      is_success: true,
      message: 'Successfully fetched followees',
      followees,
    };
  }
  @Features(RequiredPermission.Users)
  @Get('/:id')
  @ApiOkResponse({
    status: 200,
    description: 'Successfully Fetch Resources',
    schema: GetUsersListSchema,
  })
  async getUserById(@Param('id') id: number) {
    return await this.userService.findUserById(id);
  }

  @Features(RequiredPermission.Guest)
  @Get('/all')
  async getUsers() {
    return await this.userService.find();
  }

  @Features(RequiredPermission.Users)
  @Patch('/:id')
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    const user = await this.userService.update(id, body);
    return {
      is_success: true,
      message: 'successfully updated the user',
      user,
    };
  }
  @Features(RequiredPermission.Users)
  @Get('/:name')
  async getUserByName(@Param('name') name: string) {
    return await this.userService.findByName(name);
  }

  @Features(RequiredPermission.Users)
  @Post('/follow/:fid')
  async followUser(@Request() req, @Param('fid') pid: number) {
    const follower = await this.userService.createRelation(req.user.id, pid);
    return follower;
  }

  @Features(RequiredPermission.Users)
  @Delete('/unfollow/:id')
  async unfollowUser(@Request() req, @Param('id') id: number) {
    const unfollow = await this.userService.unfollowUser(req.user.id, id);
    return {
      is_success: true,
      message: 'Successfully unfollowed the user',
    };
  }
}
