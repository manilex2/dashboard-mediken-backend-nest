import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PowerBiReportDetails } from '../models/embed-report-config';
import { EmbedConfig } from '../models/embed-config';
import { AuthenticationService } from './authentication.service';
import { UtilsService } from './utils.service';
import { HttpService } from '@nestjs/axios';
import { AxiosError, RawAxiosRequestHeaders } from 'axios';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class EmbedConfigService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    private readonly utilService: UtilsService,
    private readonly httpService: HttpService,
  ) {}

  async getEmbedInfo(): Promise<
    EmbedConfig | { status: number; error: string }
  > {
    try {
      const embedParams = await this.getEmbedParamsForSingleReport(
        this.configService.get<string>('powerbi.workspaceId'),
        this.configService.get<string>('powerbi.reportId'),
      );

      return {
        accessToken: embedParams.embedToken.token,
        embedUrl: embedParams.reportsDetail,
        expiry: embedParams.embedToken.expiration,
        status: 200,
      };
    } catch (err) {
      console.log(err);
      return {
        status: err.status,
        error: `Hubo un error al traer los detalles embedidos de los reportes: ${err}`,
      };
    }
  }

  async getRequestHeader(): Promise<RawAxiosRequestHeaders> {
    let tokenResponse: { accessToken: any };
    let errorResponse: any;

    try {
      tokenResponse = await this.authService.getAccessToken();
      const token = tokenResponse.accessToken;
      return {
        'Content-Type': 'application/json',
        Authorization: this.utilService.getAuthHeader(token),
      };
    } catch (err) {
      if (
        err.hasOwnProperty('error_description') &&
        err.hasOwnProperty('error')
      ) {
        errorResponse = err.error_description;
      } else {
        // Invalid PowerBI Username provided
        errorResponse = err.toString();
      }
      return {
        status: 401,
        error: errorResponse,
      };
    }
  }

  async getEmbedParamsForSingleReport(
    workspaceId: string,
    reportId: string,
    additionalDatasetId?: string,
  ): Promise<EmbedConfig> {
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
    const headers = await this.getRequestHeader();

    const { data, status } = await firstValueFrom(
      this.httpService
        .get(reportInGroupApi, {
          headers: headers,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw `Ocurrio un error en el get: ${error}`;
          }),
        ),
    );

    if (status != 200) throw await data;

    const resultJson = await data;
    const reportDetails = new PowerBiReportDetails(
      resultJson.id,
      resultJson.name,
      resultJson.embedUrl,
    );
    const reportEmbedConfig = new EmbedConfig();
    reportEmbedConfig.reportsDetail = [reportDetails];
    const datasetIds = [resultJson.datasetId];

    if (additionalDatasetId) {
      datasetIds.push(additionalDatasetId);
    }

    reportEmbedConfig.embedToken =
      await this.getEmbedTokenForSingleReportSingleWorkspace(
        reportId,
        datasetIds,
        workspaceId,
      );
    return reportEmbedConfig;
  }

  async getEmbedTokenForSingleReportSingleWorkspace(
    reportId: string,
    datasetIds: any[],
    targetWorkspaceId: string,
  ) {
    const formData = {
      reports: [
        {
          id: reportId,
        },
      ],
    };
    formData['datasets'] = [];
    for (const datasetId of datasetIds) {
      formData['datasets'].push({
        id: datasetId,
      });
    }

    if (targetWorkspaceId) {
      formData['targetWorkspaces'] = [];
      formData['targetWorkspaces'].push({
        id: targetWorkspaceId,
      });
    }

    const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken';
    const headers = await this.getRequestHeader();

    const { data, status } = await lastValueFrom(
      this.httpService
        .post(embedTokenApi, JSON.stringify(formData), {
          headers,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw `Ocurrio un error en el post: ${error}`;
          }),
        ),
    );

    if (status != 200) throw await data;
    return await data;
  }
}
