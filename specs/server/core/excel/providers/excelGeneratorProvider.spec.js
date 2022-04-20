import { describe, it } from 'mocha';
import { expect } from 'chai';
import ExcelGeneratorProvider from '../../../../../server/core/excel/providers/excelGeneratorProvider';
import ExcelCsvFlatFileGenerator from '../../../../../server/core/excel/generators/excelCsvFlatFileGenerator';
import ExcelGeneratorOptions from '../../../../../server/core/excel/generators/excelGeneratorOptions';

describe('ExcelGeneratorProvider', () => {
    let subject;

    beforeEach(() => {
        subject = new ExcelGeneratorProvider();
    });

    context('getCsvGenerator', () => {
        it('Should return a valid instance of a ExcelCsvFlatFileGenerator when called', () => {
            const generator = subject.getCsvGenerator();
            expect(generator).to.be.instanceOf(ExcelCsvFlatFileGenerator);
        });

        it('Should accept the same excel options that were originally provided', () => {
            const options = new ExcelGeneratorOptions();
            options.defaultSheetName = 'TEST';

            const generator = subject.getCsvGenerator(options);
            expect(generator.getExcelOptions()).to.eql(options);
        });
    });
});
