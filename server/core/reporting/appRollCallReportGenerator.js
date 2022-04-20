import * as _ from '../sql/sqlDataTypes';

export default class AppRollCallReportGenerator {
    constructor(reportOptions, excelOptions, sqlConnectionWorker, excelGenerator, excelRowWriter) {
        this.reportOptions = reportOptions;
        this.excelOptions = excelOptions;
        this.sqlConnectionWorker = sqlConnectionWorker;
        this.excelGenerator = excelGenerator;
        this.excelRowWriter = excelRowWriter;
        this.storedProcName = 'usp_GetWorkstationInventoryByCompanyID';
    }

    runReport() {
        return new Promise((resolve, reject) => {
            let inputParameters;
            let outputParameters;

            try {
                inputParameters = this._buildInputParameters();
                outputParameters = this._buildOutputParameters();
            } catch (e) {
                reject(e.message);
                return;
            }

            this.sqlConnectionWorker.execute(null, this.storedProcName, inputParameters, outputParameters)
                .then((result) => { // data, returnValueMap
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    saveReportToStream(res) {
        return new Promise((resolve, reject) => {
            this.runReport().then((result) => {
                result.data.forEach((singleRow) => {
                    this.excelRowWriter.write(singleRow);
                });

                this.excelGenerator.writeToResponseStream(null, res);

                resolve({});
            }).catch((err) => {
                reject(err);
            });
        });
    }

    _buildInputParameters() {
        const inputParameters = [];

        inputParameters.push({
            name: 'CompanyID',
            type: _.SqlIntType,
            value: this.reportOptions.companyId,
        });

        if (this.reportOptions.startDateRange.length === 0) {
            throw Error('A valid date start range is required');
        }

        if (this.reportOptions.endDateRange.length === 0) {
            throw Error('A valid date end rage is required');
        }

        inputParameters.push({
            name: 'StartDate',
            type: _.SqlDateTimeType,
            value: this.reportOptions.startDateRange,
        });

        inputParameters.push({
            name: 'EndDate',
            type: _.SqlDateTimeType,
            value: this.reportOptions.endDateRange,
        });

        if (this.reportOptions.dnsName.length > 0) {
            inputParameters.push({
                name: 'DNS',
                type: _.SqlVarCharType,
                value: this.reportOptions.dnsName,
                options: {
                    length: 50,
                },
            });
        }

        if (this.reportOptions.userName.length > 0) {
            inputParameters.push({
                name: 'UserName',
                type: _.SqlVarCharType,
                value: this.reportOptions.userName,
                options: {
                    length: 60,
                },
            });
        }

        if (this.reportOptions.includeTestData) {
            inputParameters.push({
                name: 'IncludeTestDNS',
                type: _.SqlBitType,
                value: 1,
            });
        }

        return inputParameters;
    }

    _buildOutputParameters() {
        return [
            {
                name: 'ResultCode',
                type: _.SqlVarCharType,
            },
            {
                name: 'ResultMessage',
                type: _.SqlVarCharType,
            },
        ];
    }
}
