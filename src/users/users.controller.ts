import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { Features } from 'src/auth/decorator/role.decorator';
import { UsersService } from 'src/users/users.service';
import { RequiredPermission } from 'src/utils/constants';
import { UpdateUserDto } from './dto/createuser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Features(RequiredPermission.Users)
  @Get('/:id')
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
  async followUser(@Request() req, @Param('pid') pid: number) {
    const follower = await this.userService.createRelation(req.user.id, pid);
    return follower;
  }
}
