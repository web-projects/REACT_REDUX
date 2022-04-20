import ExcelCsvFlatFileGenerator from '../generators/excelCsvFlatFileGenerator';
import ExcelGeneratorOptions from '../generators/excelGeneratorOptions';

export default class ExcelGeneratorProvider {
    getCsvGenerator(excelOptions) {
        return new ExcelCsvFlatFileGenerator(excelOptions || new ExcelGeneratorOptions());
    }
}
