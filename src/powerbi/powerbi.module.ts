import { Module } from '@nestjs/common';
import { PowerbiController } from './powerbi.controller';
import { PowerbiService } from './services/powerbi.service';
import { AuthenticationService } from './services/authentication.service';
import { EmbedConfigService } from './services/embed-config.service';
import { UtilsService } from './services/utils.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PowerbiController],
  providers: [
    PowerbiService,
    AuthenticationService,
    EmbedConfigService,
    UtilsService,
  ],
})
export class PowerbiModule {}
