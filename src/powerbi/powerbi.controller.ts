import { Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { PowerbiService } from './services/powerbi.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EmbedConfigService } from './services/embed-config.service';

@Controller('powerbi')
export class PowerbiController {
  constructor(
    private powerBITokenService: PowerbiService,
    private embedConfigService: EmbedConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('getToken')
  async getEmbedToken() {
    try {
      const configSuccess = await this.powerBITokenService.getToken();
      if (configSuccess.status != 200) {
        throw configSuccess;
      }
      const result = await this.embedConfigService.getEmbedInfo();
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
