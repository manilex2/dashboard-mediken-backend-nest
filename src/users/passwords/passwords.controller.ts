import {
  Body,
  Controller,
  HttpException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from '../dto/user/userDTO';
import { UsersService } from '../users.service';

@Controller('users/passwords')
export class PasswordsController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':idCodigo')
  updatePassword(@Param('idCodigo') id: string, @Body() userDto: UserDto) {
    try {
      const user: Promise<object> = this.usersService.updatePassword(
        id,
        userDto,
      );
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
