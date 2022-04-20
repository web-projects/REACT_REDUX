import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import ReportGeneratorProvider from '../../../../server/core/providers/reportGeneratorProvider';
import SqlConnectionWorkerProvider from '../../../../server/core/sql/providers/sqlConnectionWorkerProvider';
import ExcelGeneratorProvider from '../../../../server/core/excel/providers/excelGeneratorProvider';
import ExcelRowWriterProvider from '../../../../server/core/excel/providers/excelRowWriterProvider';
import ReportGenerationStandardOptions from '../../../../server/core/reporting/reportGenerationStandardOptions';
import AppRollCallReportGenerator from '../../../../server/core/reporting/appRollCallReportGenerator';
import VolumeCountReportGenerator from '../../../../server/core/reporting/volumeCountReportGenerator';
import * as _ from '../../../../server/core/sql/ipa5SqlDbTypes';

describe('ReportGeneratorProvider', () => {
    let subject;

    beforeEach(() => {
        subject = new ReportGeneratorProvider();
    });

    context('constructor', () => {
        it('Should return a valid instance of connectionWorker and excelGenerator', () => {
            expect(subject.connectionWorkerProvider).to.be.instanceOf(SqlConnectionWorkerProvider);
            expect(subject.excelGeneratorProvider).to.be.instanceOf(ExcelGeneratorProvider);
            expect(subject.excelRowWriterProvider).to.be.instanceOf(ExcelRowWriterProvider);
        });
    });

    context('getAppRollCallReportGenerator', () => {
        const reportOptions = new ReportGenerationStandardOptions();

        let getCsvGeneratorStub;
        let getExcelOptionsStub;
        let getConnectionWorkerStub;
        let getStandardRowWriterStub;
        let fakeGenerator;

        beforeEach(() => {
            fakeGenerator = {
                getExcelOptions: () => {},
            };
            const fakeExcelOptions = {
                targetedStyles: {
                    headerStyle: {},
                    rowStyles: {},
                },
            };
            const fakeConnectionWorker = {};
            const fakeStandardRowWriter = {};

            getCsvGeneratorStub = sinon.stub(subject.excelGeneratorProvider, 'getCsvGenerator').callsFake((e) => fakeGenerator);
            getExcelOptionsStub = sinon.stub(fakeGenerator, 'getExcelOptions').callsFake(() => fakeExcelOptions);
            getConnectionWorkerStub = sinon.stub(subject.connectionWorkerProvider, 'getConnectionWorker').callsFake((e) => fakeConnectionWorker);
            getStandardRowWriterStub = sinon.stub(subject.excelRowWriterProvider, 'getStandardRowWriter').callsFake((e) => fakeStandardRowWriter);
        });

        it('Should return a valid instance of a AppRollCallReportGenerator when called', () => {
            expect(subject.getAppRollCallReportGenerator(reportOptions, {}))
                .to.be.instanceOf(AppRollCallReportGenerator);
        });

        it('Should call the stubbed functions when called', () => {
            subject.getAppRollCallReportGenerator(reportOptions, {});

            expect(getCsvGeneratorStub.withArgs({}).callCount).to.equal(1);
            expect(getExcelOptionsStub.callCount).to.equal(1);
            expect(getConnectionWorkerStub.withArgs(_.IPAv5DbType).callCount).to.equal(1);
            expect(getStandardRowWriterStub.withArgs(fakeGenerator).callCount).to.equal(1);
        });

        it('Should issue Error when called with null reportOptions', () => {
            expect(() => subject.getAppRollCallReportGenerator(null, {}))
                .to.throw('Invalid report options provided');
        });

        it('Should issue Error when called with undefined reportOptions', () => {
            expect(() => subject.getAppRollCallReportGenerator(undefined, {}))
                .to.throw('Invalid report options provided');
        });

        it('Should issue Error when called with reportOptions of improper type', () => {
            expect(() => subject.getAppRollCallReportGenerator(1, {}))
                .to.throw('Invalid report options type provided');
        });
    });

    context('getVolumeCountReportGenerator', () => {
        const reportOptions = new ReportGenerationStandardOptions();

        let getCsvGeneratorStub;
        let getExcelOptionsStub;
        let getConnectionWorkerStub;
        let getStandardRowWriterStub;
        let fakeGenerator;

        beforeEach(() => {
            fakeGenerator = {
                getExcelOptions: () => {},
            };
            const fakeExcelOptions = {
                targetedStyles: {
                    headerStyle: {},
                },
            };
            const fakeConnectionWorker = {};
            const fakeStandardRowWriter = {};

            getCsvGeneratorStub = sinon.stub(subject.excelGeneratorProvider, 'getCsvGenerator').callsFake((e) => fakeGenerator);
            getExcelOptionsStub = sinon.stub(fakeGenerator, 'getExcelOptions').callsFake(() => fakeExcelOptions);
            getConnectionWorkerStub = sinon.stub(subject.connectionWorkerProvider, 'getConnectionWorker').callsFake((e) => fakeConnectionWorker);
            getStandardRowWriterStub = sinon.stub(subject.excelRowWriterProvider, 'getStandardRowWriter').callsFake((e) => fakeStandardRowWriter);
        });

        it('Should return a valid instance of a AppRollCallReportGenerator when called', () => {
            expect(subject.getVolumeCountReportGenerator(reportOptions, {}))
                .to.be.instanceOf(VolumeCountReportGenerator);
        });

        it('Should call the stubbed functions when called', () => {
            subject.getVolumeCountReportGenerator(reportOptions, {});

            expect(getCsvGeneratorStub.withArgs({}).callCount).to.equal(1);
            expect(getExcelOptionsStub.callCount).to.equal(1);
            expect(getConnectionWorkerStub.withArgs(_.DataWarehouseDbType).callCount).to.equal(1);
            expect(getStandardRowWriterStub.withArgs(fakeGenerator).callCount).to.equal(1);
        });

        it('Should issue Error when called with null reportOptions', () => {
            expect(() => subject.getVolumeCountReportGenerator(null, {}))
                .to.throw('Invalid report options provided');
        });

        it('Should issue Error when called with undefined reportOptions', () => {
            expect(() => subject.getVolumeCountReportGenerator(undefined, {}))
                .to.throw('Invalid report options provided');
        });

        it('Should issue Error when called with reportOptions of improper type', () => {
            expect(() => subject.getVolumeCountReportGenerator(1, {}))
                .to.throw('Invalid report options type provided');
        });
    });
});
