import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as guid from 'guid';

@Injectable()
export class UtilsService {
  constructor(private readonly configService: ConfigService) {}

  public getAuthHeader(accessToken: string): string {
    return `Bearer ${accessToken}`;
  }

  public validateConfig(): string {
    if (!this.configService.get<string>('msal.authenticationMode')) {
      return 'AuthenticationMode is empty. Please choose MasterUser or ServicePrincipal in config.json.';
    }

    if (
      this.configService
        .get<string>('msal.authenticationMode')
        .toLowerCase() !== 'masteruser' &&
      this.configService
        .get<string>('msal.authenticationMode')
        .toLowerCase() !== 'serviceprincipal'
    ) {
      return 'AuthenticationMode is wrong. Please choose MasterUser or ServicePrincipal in config.json';
    }

    if (!this.configService.get<string>('msal.clientId')) {
      return 'ClientId is empty. Please register your application as Native app in https://dev.powerbi.com/apps and fill Client Id in config.json.';
    }

    if (!guid.isGuid(this.configService.get<string>('msal.clientId'))) {
      return 'ClientId must be a Guid object. Please register your application as Native app in https://dev.powerbi.com/apps and fill Client Id in config.json.';
    }

    if (!this.configService.get<string>('powerbi.reportId')) {
      return 'ReportId is empty. Please select a report you own and fill its Id in config.json.';
    }

    if (!guid.isGuid(this.configService.get<string>('powerbi.reportId'))) {
      return 'ReportId must be a Guid object. Please select a report you own and fill its Id in config.json.';
    }

    if (!this.configService.get<string>('powerbi.workspaceId')) {
      return 'WorkspaceId is empty. Please select a group you own and fill its Id in config.json.';
    }

    if (!guid.isGuid(this.configService.get<string>('powerbi.workspaceId'))) {
      return 'WorkspaceId must be a Guid object. Please select a workspace you own and fill its Id in config.json.';
    }

    if (!this.configService.get<string>('msal.authorityUrl')) {
      return 'AuthorityUrl is empty. Please fill valid AuthorityUrl in config.json.';
    }

    if (
      this.configService
        .get<string>('msal.authenticationMode')
        .toLowerCase() === 'masteruser'
    ) {
      if (
        !this.configService.get<string>('powerbi.pbiUsername') ||
        !this.configService.get<string>('powerbi.pbiUsername').trim()
      ) {
        return 'PbiUsername is empty. Please fill Power BI username in config.json.';
      }

      if (
        !this.configService.get<string>('powerbi.pbiPassword') ||
        !this.configService.get<string>('powerbi.pbiPassword').trim()
      ) {
        return 'PbiPassword is empty. Please fill password of Power BI username in config.json.';
      }
    } else if (
      this.configService
        .get<string>('msal.authenticationMode')
        .toLowerCase() === 'serviceprincipal'
    ) {
      if (
        !this.configService.get<string>('msal.clientSecret') ||
        !this.configService.get<string>('msal.clientSecret').trim()
      ) {
        return 'ClientSecret is empty. Please fill Power BI ServicePrincipal ClientSecret in config.json.';
      }

      if (!this.configService.get<string>('msal.tenantId')) {
        return 'TenantId is empty. Please fill the TenantId in config.json.';
      }

      if (!guid.isGuid(this.configService.get<string>('msal.tenantId'))) {
        return 'TenantId must be a Guid object. Please select a workspace you own and fill its Id in config.json.';
      }
    }
  }
}
