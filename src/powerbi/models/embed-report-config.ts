// embedReportConfig.model.ts
export class PowerBiReportDetails {
  constructor(
    public reportId: string,
    public reportName: string,
    public embedUrl: string,
  ) {}
}
