import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Users } from 'src/users/users.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(username: string, password: string): Promise<Users> {
    const user = await this.authService.validateUser(username, password);
    console.log('local-auth strategy validate method');
    if (!user) {
      throw new UnauthorizedException({
        is_success: false,
        message: 'Kindly provide correct credentials.',
      });
    }

    return user;
  }
}
