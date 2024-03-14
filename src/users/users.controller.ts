import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ImgDto } from './dto/img/imgDto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as sharp from 'sharp';
import { UserDto } from './dto/user/userDto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Put('change-password/:usuario')
  async updatePassword(@Param('usuario') id: string, @Body() userDto: UserDto) {
    try {
      const changePass: Promise<object> = this.usersService.updatePassword(
        id,
        userDto,
      );
      return changePass;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('first-login/:usuario')
  async updateFirstLogin(
    @Param('usuario') id: string,
    @Body() userDto: UserDto,
  ) {
    try {
      if (userDto.img) {
        const imageBuffer = Buffer.from(
          userDto.img.toString().split(',')[1],
          'base64',
        );
        const compressedImageBuffer = await sharp(imageBuffer)
          .resize(200)
          .png()
          .toBuffer();
        userDto.img = compressedImageBuffer;
      }
      const user: Promise<object> = this.usersService.updateFirstLogin(
        id,
        userDto,
      );
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('img/:usuario')
  @UseInterceptors(FileInterceptor('img'))
  async updateProfileImg(@Param('usuario') id: string, @Body() imgDto: ImgDto) {
    try {
      const imageBuffer = Buffer.from(imgDto.img.split(',')[1], 'base64');
      const compressedImageBuffer = await sharp(imageBuffer)
        .resize(200)
        .png()
        .toBuffer();
      const img: Promise<object> = this.usersService.updateProfileImg(
        id,
        compressedImageBuffer,
      );
      return img;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('img/:usuario')
  @UseInterceptors(FileInterceptor('img'))
  async getProfileImg(@Param('usuario') id: string) {
    try {
      const img: Promise<object> = this.usersService.getProfileImg(id);
      return img;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
