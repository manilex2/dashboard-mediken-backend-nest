import { PowerBiReportDetails } from './embed-report-config';

export class EmbedConfig {
  constructor(
    public type?: string,
    public reportsDetail?: PowerBiReportDetails[],
    public embedToken?: {
      token: string;
      expiration: string;
    },
    public embedUrl?: PowerBiReportDetails[],
    public expiry?: string,
    public status?: number,
    public error?: string,
    public accessToken?: string,
  ) {}
}
