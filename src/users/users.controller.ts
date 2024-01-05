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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ImgDto } from './dto/img/imgDto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as sharp from 'sharp';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('img/:idCodigo')
  @UseInterceptors(FileInterceptor('img'))
  async updateProfileImg(
    @Param('idCodigo') id: string,
    @Body() imgDto: ImgDto,
  ) {
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
  @Get('img/:idCodigo')
  @UseInterceptors(FileInterceptor('img'))
  async getProfileImg(@Param('idCodigo') id: string) {
    try {
      const img: Promise<object> = this.usersService.getProfileImg(id);
      return img;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
