import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PublicClientApplication,
  ConfidentialClientApplication,
  AuthenticationResult,
} from '@azure/msal-node';

@Injectable()
export class AuthenticationService {
  constructor(private readonly configService: ConfigService) {}

  async getAccessToken(): Promise<AuthenticationResult> {
    const msalConfig = {
      auth: {
        clientId: this.configService.get<string>('msal.clientId'),
        authority: `${this.configService.get<string>(
          'msal.authorityUrl',
        )}${this.configService.get<string>('msal.tenantId')}`,
        clientSecret: '',
      },
    };

    if (
      this.configService
        .get<string>('msal.authenticationMode')
        .toLowerCase() === 'masteruser'
    ) {
      const clientApplication = new PublicClientApplication(msalConfig);

      const usernamePasswordRequest = {
        scopes: [this.configService.get<string>('msal.scopeBase')],
        username: this.configService.get<string>('powerbi.pbiUsername'),
        password: this.configService.get<string>('powerbi.pbiPassword'),
      };

      return clientApplication.acquireTokenByUsernamePassword(
        usernamePasswordRequest,
      );
    }

    if (
      this.configService
        .get<string>('msal.authenticationMode')
        .toLowerCase() === 'serviceprincipal'
    ) {
      msalConfig.auth.clientSecret =
        this.configService.get<string>('msal.clientSecret');
      const clientApplication = new ConfidentialClientApplication(msalConfig);

      const clientCredentialRequest = {
        scopes: [this.configService.get<string>('msal.scopeBase')],
      };

      return clientApplication.acquireTokenByClientCredential(
        clientCredentialRequest,
      );
    }

    return null;
  }
}
