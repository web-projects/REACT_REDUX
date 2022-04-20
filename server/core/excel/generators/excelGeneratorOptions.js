export default class ExcelGeneratorOptions {
    constructor() {
        // If true, the generator will infer the columns from the object
        // itself with no consideration on column sorting.
        this.shouldInferColumns = true;
        // An array of column names in the order that columns should
        // be sorted in the excel sheet.
        this.columnSortArray = [];
        // If true, a column header will be provided in the excel sheet automatically.
        this.showColumn = true;
        // The default name of the first sheet if none is specified.
        this.defaultSheetName = 'Sheet 1';
        // Style information that should be applied to the excel sheet overall.
        this.style = {
            font: {
                name: 'Calibri',
                bold: false,
                color: '#000000',
                size: 12,
            },
            alignment: {
                wrapText: true,
                horizontal: 'center',
            },
            dateFormat: '',
            numberFormat: '',
        };
        // Style information that should be applied to entire columns and headers.
        this.targetedStyles = {
            headerStyle: {},
            rowStyles: {},
        };
        // Function that can be utilized to transform the header values.
        this.headerValueTransformFn = null;
    }
}
