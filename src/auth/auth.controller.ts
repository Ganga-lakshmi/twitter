import { Body, Controller, Post, Req } from '@nestjs/common';
import { createUserDto } from './../users/dto/createuser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
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

  //@UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Req() req) {
    const user = await this.authService.signin(req.user);
    console.log('after signin functon last op');
    return {
      is_success: true,
      message: 'Successfully logged-in.',
      user,
    };
  }
}
