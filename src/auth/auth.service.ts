import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserInterface } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  async validateUser(email: string, pass: string): Promise<UserInterface | null> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: UserInterface) {
    const payload = { email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
