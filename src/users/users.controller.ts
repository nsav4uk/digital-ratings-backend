import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.decorator';
import { UserInterface } from './user.entity';

@Controller('user')
export class UsersController {
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  profile(@User() user: UserInterface) {
    return user;
  }
}
