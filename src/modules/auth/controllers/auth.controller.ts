import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services';
import { CreateUserDto } from '../../user/DTO';
import { LoginDTO } from '../DTO';
import { Public } from '../decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @Public()
  registration(@Body() user: CreateUserDto) {
    return this.authService.registration(user);
  }

  @Post('login')
  @Public()
  login(@Body() user: LoginDTO) {
    return this.authService.login(user);
  }
}
