import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/users.entity';
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async passwordHashing(password: string) {
    return await bcrypt.hash(password, 12);
  }

  async signup(_userParams: Partial<Users>) {
    const hashedpassword = await this.passwordHashing(_userParams.password);
    const user = await this.usersService.create({
      ..._userParams,
      password: hashedpassword,
    });
    return user;
  }

  async signin(_user: Partial<Users>) {
    const payload = { email: _user.email, sub: _user.id };
    return {
      id: _user.id,
      name: _user.name,
      email: _user.email,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (user && isPasswordMatched) {
      const { password, ...result } = user;
      return result;
    }
  }
}
