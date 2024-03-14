import { Controller, Get, HttpException, Req, UseGuards } from '@nestjs/common';
import { PowerbiService } from './services/powerbi.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmbedConfigService } from './services/embed-config.service';
import { jwtDecode } from 'jwt-decode';

@Controller('powerbi')
export class PowerbiController {
  constructor(
    private powerBITokenService: PowerbiService,
    private embedConfigService: EmbedConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('getToken')
  async getEmbedToken(@Req() req) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split(' ')[1];
      const decodeToken: any = jwtDecode(token);
      const tipoUsuario = decodeToken.user.tipoUsuario;
      const configSuccess = await this.powerBITokenService.getToken();
      if (configSuccess.status != 200) {
        throw configSuccess;
      }
      const result = await this.embedConfigService.getEmbedInfo(tipoUsuario);
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
