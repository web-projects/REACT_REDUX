import ExcelStandardRowWriter from '../writers/excelStandardRowWriter';

export default class ExcelRowWriterProvider {
    getStandardRowWriter(generator) {
        return new ExcelStandardRowWriter(generator);
    }
}
