import SqlConnectionWorkerProvider from '../sql/providers/sqlConnectionWorkerProvider';
import ExcelGeneratorProvider from '../excel/providers/excelGeneratorProvider';
import ExcelRowWriterProvider from '../excel/providers/excelRowWriterProvider';
import * as _ from '../sql/ipa5SqlDbTypes';
import * as EC from '../excel/excelConstants';
import AppRollCallReportGenerator from '../reporting/appRollCallReportGenerator';
import VolumeCountReportGenerator from '../reporting/volumeCountReportGenerator';
import ReportGenerationStandardOptions from '../reporting/reportGenerationStandardOptions';

export default class ReportGeneratorProvider {
    constructor() {
        this.connectionWorkerProvider = new SqlConnectionWorkerProvider();
        this.excelGeneratorProvider = new ExcelGeneratorProvider();
        this.excelRowWriterProvider = new ExcelRowWriterProvider();
    }

    getAppRollCallReportGenerator(reportOptions, excelOptions) {
        if (reportOptions === null || reportOptions === undefined) {
            throw Error('Invalid report options provided');
        }

        if (!(reportOptions instanceof ReportGenerationStandardOptions)) {
            throw Error('Invalid report options type provided');
        }

        const generator = this.excelGeneratorProvider.getCsvGenerator(excelOptions);
        const generatorExcelOptions = generator.getExcelOptions();
        generatorExcelOptions.headerValueTransformFn = ((headerValue) => {
            switch (headerValue) {
                case 'dns':
                    return 'Dns';
                case 'username':
                    return 'Username';
                case 'firmwareversion':
                    return 'FirmwareVersion';
                case 'debit':
                    return 'Debit';
                case 'version':
                    return 'Version';
                case 'serialnumber':
                    return 'SerialNumber';
                case 'MfgName':
                    return 'Manufacturer';
                case 'model':
                    return 'Model';
                case 'last_rollcall':
                    return 'LastRollCall';
                default:
                    return headerValue;
            }
        });

        generatorExcelOptions.targetedStyles.headerStyle = EC.DefaultExcelHeaderStyle;

        const connectionWorker = this.connectionWorkerProvider.getConnectionWorker(_.IPAv5DbType);
        const standardRowWriter = this.excelRowWriterProvider.getStandardRowWriter(generator);

        return new AppRollCallReportGenerator(
            reportOptions,
            generatorExcelOptions,
            connectionWorker,
            generator,
            standardRowWriter,
        );
    }

    getVolumeCountReportGenerator(reportOptions, excelOptions) {
        if (reportOptions === null || reportOptions === undefined) {
            throw Error('Invalid report options provided');
        }

        if (!(reportOptions instanceof ReportGenerationStandardOptions)) {
            throw Error('Invalid report options type provided');
        }

        const generator = this.excelGeneratorProvider.getCsvGenerator(excelOptions);
        const generatorExcelOptions = generator.getExcelOptions();

        const connectionWorker = this.connectionWorkerProvider.getConnectionWorker(_.DataWarehouseDbType);
        const standardRowWriter = this.excelRowWriterProvider.getStandardRowWriter(generator);

        generatorExcelOptions.headerValueTransformFn = ((headerValue) => {
            switch (headerValue) {
                case 'TransDate':
                    return 'TransactionDate';
                case 'IPACompanyID':
                    return 'CompanyID';
                case 'IPACompanyName':
                    return 'CompanyName';
                case 'IPAProvisionedController':
                    return 'ProvisionedController';
                case 'CustID':
                    return 'CustomerID';
                default:
                    return headerValue;
            }
        });

        generatorExcelOptions.targetedStyles.headerStyle = EC.DefaultExcelHeaderStyle;

        generatorExcelOptions.targetedStyles.rowStyles = {
            TransDate: {
                numberFormat: EC.StandardDateFormat,
            },
            Volume: {
                numberFormat: EC.StandardMoneyFormat,
            },
        };

        return new VolumeCountReportGenerator(
            reportOptions,
            generatorExcelOptions,
            connectionWorker,
            generator,
            standardRowWriter,
        );
    }
}
