export default class ReportGenerationStandardOptions {
    constructor() {
        this.startDateRange = '';
        this.endDateRange = '';
        this.startDate = {
            day: 1,
            month: 1,
            year: 1900,
        };
        this.endDate = {
            day: 1,
            month: 1,
            year: 1900,
        };
        // Note: Limit is ignored until UI phase begins.
        this.limit = -1;
        this.companyId = 0;
        this.dnsName = '';
        this.userName = '';
        this.includeTestData = (process.env.NODE_ENV === 'development');
    }
}
