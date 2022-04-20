import { describe, it } from 'mocha';
import { expect } from 'chai';
import ExcelStandardRowWriter from '../../../../../server/core/excel/writers/excelStandardRowWriter';
import ExcelRowWriterProvider from '../../../../../server/core/excel/providers/excelRowWriterProvider';
import ExcelGeneratorOptions from '../../../../../server/core/excel/generators/excelGeneratorOptions';
import ExcelCsvFlatFileGenerator from '../../../../../server/core/excel/generators/excelCsvFlatFileGenerator';

describe('ExcelRowWriterProvider', () => {
    let subject;
    let generator;

    beforeEach(() => {
        generator = new ExcelCsvFlatFileGenerator(new ExcelGeneratorOptions());
        subject = new ExcelRowWriterProvider();
    });

    context('getStandardRowWriter', () => {
        it('Should return a valid instance of a ExcelStandardRowWriter when called', () => {
            const rowWriter = subject.getStandardRowWriter(generator);
            expect(rowWriter).to.be.instanceOf(ExcelStandardRowWriter);
        });
    });
});
