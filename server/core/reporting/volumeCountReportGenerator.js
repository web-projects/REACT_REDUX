import * as _ from '../sql/sqlDataTypes';

export default class VolumeCountReportGenerator {
    constructor(reportOptions, excelOptions, sqlConnectionWorker, excelGenerator, excelRowWriter) {
        this.reportOptions = reportOptions;
        this.excelOptions = excelOptions;
        this.sqlConnectionWorker = sqlConnectionWorker;
        this.excelGenerator = excelGenerator;
        this.excelRowWriter = excelRowWriter;
        this.storedProcName = 'IPA_Counts_Volume';
    }

    runReport() {
        return new Promise((resolve, reject) => {
            let inputParameters;

            try {
                inputParameters = this._buildInputParameters();
            } catch (e) {
                reject(e.message);
                return;
            }

            this.sqlConnectionWorker.execute(null, this.storedProcName, inputParameters, null)
                .then((result) => {
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

        if (this.reportOptions.companyId > 0) {
            inputParameters.push({
                name: 'CompanyID',
                type: _.SqlIntType,
                value: this.reportOptions.companyId,
            });
        }

        inputParameters.push({
            name: 'StartDateMonth',
            type: _.SqlIntType,
            value: this.reportOptions.startDate.month,
        });

        inputParameters.push({
            name: 'StartDateYear',
            type: _.SqlIntType,
            value: this.reportOptions.startDate.year,
        });

        inputParameters.push({
            name: 'EndDateMonth',
            type: _.SqlIntType,
            value: this.reportOptions.endDate.month,
        });

        inputParameters.push({
            name: 'EndDateYear',
            type: _.SqlIntType,
            value: this.reportOptions.endDate.year,
        });

        return inputParameters;
    }

    _buildOutputParameters() {
        return [];
    }
}
