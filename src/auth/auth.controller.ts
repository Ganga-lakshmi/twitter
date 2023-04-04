import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RequiredPermission } from 'src/utils/constants';
import { createUserDto } from './../users/dto/createuser.dto';
import { AuthService } from './auth.service';
import { Features } from './decorator/role.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Features(RequiredPermission.Guest)
  @Post('/signup')
  async createUser(@Body() body: createUserDto) {
    body.email = body.email.toLowerCase();
    const user = await this.authService.signup(body);
    return {
      is_success: true,
      message: 'successfully created user',
      user,
    };
  }

  @Features(RequiredPermission.Guest)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Req() req) {
    const user = await this.authService.signin(req.user);
    return {
      is_success: true,
      message: 'Successfully logged-in.',
      user,
    };
  }
}
