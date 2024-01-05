import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { UserDto } from '../users/dto/user/userDTO';
import { Afiliado, Beneficiario, Broker, MedikenUser } from 'src/users/models';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post()
  async getUser(@Body() userDto: UserDto) {
    try {
      const user: Promise<MedikenUser | Beneficiario | Broker | Afiliado> =
        this.authService.getUser(userDto);
      const accessToken = this.authService.login((await user).dataValues);
      return [await accessToken];
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() userDto: UserDto) {
    try {
      const user: Promise<object> = this.authService.resetPassword(userDto);
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
