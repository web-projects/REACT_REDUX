import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import ExcelStandardRowWriter from '../../../../../server/core/excel/writers/excelStandardRowWriter';
import ExcelGeneratorOptions from '../../../../../server/core/excel/generators/excelGeneratorOptions';
import ExcelCsvFlatFileGenerator from '../../../../../server/core/excel/generators/excelCsvFlatFileGenerator';

describe('ExcelStandardRowWriter', () => {
    let subject;
    let excelOptions;
    let generator;

    beforeEach(() => {
        excelOptions = new ExcelGeneratorOptions();
        generator = new ExcelCsvFlatFileGenerator(excelOptions);
        subject = new ExcelStandardRowWriter(generator);
    });

    context('constructor', () => {
        it('Should set the generator object that was provided', () => {
            expect(subject._generator).to.eql(generator);
        });

        it('Should set the options to that which is inside of the generator object', () => {
            expect(subject._options).to.eql(excelOptions);
        });

        it('Should set tracking objects to their appropriate starting values', () => {
            expect(subject._rowsWritten).to.equal(0);
            expect(subject._lastRowIndex).to.equal(1);
            expect(subject._columnHeaderWritten).to.be.false;
            expect(subject._columns.length).to.equal(0);
        });

        it('Should set the header value transformation function accordingly', () => {
            const expectedValue = 'First';
            expect(subject._options.headerValueTransformFn(expectedValue)).to.equal(expectedValue);
        });

        it('Should blow up when the header value provided to the transformation function is not a valid string', () => {
            expect(() => subject._options.headerValueTransformFn(5))
                .to.throw('Parameter for header value transformation is not a string.');
        });
    });

    context('getRowsWritten', () => {
        it('Should get the number of rows written and it should match preset value', () => {
            const expectedRowsWritten = 5;

            subject._rowsWritten = expectedRowsWritten;

            const actualRowsWritten = subject.getRowsWritten();
            expect(actualRowsWritten).to.be.equal(expectedRowsWritten);
        });
    });

    context('getColumnHeaderWritten', () => {
        it('Should get the number of column headers written and it should match preset value', () => {
            const expectedColumnHeaderWritten = 10;

            subject._columnHeaderWritten = expectedColumnHeaderWritten;

            const actualColumnHeaderWritten = subject.getColumnHeaderWritten();
            expect(actualColumnHeaderWritten).to.be.equal(expectedColumnHeaderWritten);
        });
    });

    context('write', () => {
        const predefinedColumns = [
            'first',
            'last',
            'age',
            'seniorCitizen',
        ];

        const rowObject = {
            first: 'John',
            last: 'Doe',
            age: 31,
            seniorCitizen: false,
            created: new Date(2022, 4, 5),
        };

        let writeHeaderStub;
        let getColumnsStub;
        let addCellNumberStub;
        let addCellBoolStub;
        let addCellStringStub;
        let addCellDateStub;
        let setCellStyleStub;

        beforeEach(() => {
            writeHeaderStub = sinon.stub(subject, '_writeHeader').callsFake((e) => {});
            getColumnsStub = sinon.stub(subject, '_getColumns').callsFake((e) => predefinedColumns);
            addCellNumberStub = sinon.stub(generator, 'addCellNumber').callsFake((r, c, v) => {});
            addCellBoolStub = sinon.stub(generator, 'addCellBool').callsFake((r, c, v) => {});
            addCellStringStub = sinon.stub(generator, 'addCellString').callsFake((r, c, v) => {});
            addCellDateStub = sinon.stub(generator, 'addCellDate').callsFake((r, c, v) => {});
            setCellStyleStub = sinon.stub(generator, 'setCellStyle').callsFake((r, c, v) => {});

            subject._columnHeaderWritten = true;
        });

        it('Should write the header when the appropriate options are set', () => {
            subject._columnHeaderWritten = false;

            subject.write(rowObject);

            expect(writeHeaderStub.withArgs(rowObject).callCount).to.equal(1);
            expect(getColumnsStub.withArgs(rowObject).callCount).to.equal(1);
        });

        it('Should not write the header when the column headers have not been written yet', () => {
            subject._columnHeaderWritten = true;

            subject.write(rowObject);

            sinon.assert.notCalled(writeHeaderStub);
        });

        it('Should not write the header when the excel options do not permit it', () => {
            subject._columnHeaderWritten = false;
            excelOptions.showColumn = false;

            subject.write(rowObject);

            sinon.assert.notCalled(writeHeaderStub);
        });

        it('Should call the "addCellNumber" method on the generator when the property value is a number', () => {
            getColumnsStub.restore();
            getColumnsStub = sinon.stub(subject, '_getColumns').callsFake((e) => ['age']);

            subject.write(rowObject);

            expect(addCellNumberStub.withArgs(1, 1, 31).callCount).to.equal(1);
        });

        it('Should call the "addCellBool" method on the generator when the property value is a boolean', () => {
            getColumnsStub.restore();
            getColumnsStub = sinon.stub(subject, '_getColumns').callsFake((e) => ['seniorCitizen']);

            subject.write(rowObject);

            expect(addCellBoolStub.withArgs(1, 1, false).callCount).to.equal(1);
        });

        it('Should call the "addCellString" method on the generator when the property value is a string', () => {
            getColumnsStub.restore();
            getColumnsStub = sinon.stub(subject, '_getColumns').callsFake((e) => ['first', 'last']);

            subject.write(rowObject);

            expect(addCellStringStub.withArgs(1, 1, 'John').callCount).to.equal(1);
            expect(addCellStringStub.withArgs(1, 2, 'Doe').callCount).to.equal(1);
        });

        it('Should call the "addCellDate" method on the generator when the property value is an object', () => {
            getColumnsStub.restore();
            getColumnsStub = sinon.stub(subject, '_getColumns').callsFake((e) => ['created']);

            subject.write(rowObject);

            expect(addCellDateStub.withArgs(1, 1, new Date(2022, 4, 5)).callCount).to.equal(1);
        });

        it('Should set a cell style if one is specified for a particular column', () => {
            excelOptions.targetedStyles.rowStyles = {
                age: {},
            };

            getColumnsStub.restore();
            getColumnsStub = sinon.stub(subject, '_getColumns').callsFake((e) => ['age']);

            subject.write(rowObject);

            expect(setCellStyleStub.withArgs(1, 1, {}).callCount).to.equal(1);
        });

        it('Should also increase the last row index', () => {
            subject.write(rowObject);

            expect(subject._lastRowIndex).to.equal(2);
        });
    });
});
