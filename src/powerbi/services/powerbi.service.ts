import { HttpStatus, Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Injectable()
export class PowerbiService {
  constructor(private readonly utilsService: UtilsService) {}

  async getToken() {
    const configCheckResult = this.utilsService.validateConfig();

    if (configCheckResult) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: configCheckResult,
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'Token obtained successfully',
    };
  }
}
