import _ from 'underscore';

export default class ExcelStandardRowWriter {
    constructor(generator) {
        this._generator = generator;
        this._options = generator.getExcelOptions();
        this._rowsWritten = 0;
        this._lastRowIndex = 1;
        this._columns = [];
        this._columnHeaderWritten = false;

        if (this._options.headerValueTransformFn === null) {
            this._options.headerValueTransformFn = ((headerValue) => {
                if (!_.isString(headerValue)) {
                    throw new Error('Parameter for header value transformation is not a string.');
                }
                return headerValue.charAt(0).toUpperCase() + headerValue.slice(1);
            });
        }
    }

    getRowsWritten() {
        return this._rowsWritten;
    }

    getColumnHeaderWritten() {
        return this._columnHeaderWritten;
    }

    write(rowObject) {
        const excelOptions = this._options;

        if (!this._columnHeaderWritten && excelOptions.showColumn) {
            this._writeHeader(rowObject);
            this._columnHeaderWritten = true;
        }

        const columns = this._getColumns(rowObject);
        let columnIndex = 1;

        columns.forEach((column) => {
            if (!(column in rowObject)) {
                throw new Error(`Unable to write row object due to missing property ${column}.`);
            }

            const propertyValue = rowObject[column];

            if (typeof propertyValue === 'number') {
                this._generator.addCellNumber(this._lastRowIndex, columnIndex, propertyValue);
            } else if (typeof propertyValue === 'boolean') {
                this._generator.addCellBool(this._lastRowIndex, columnIndex, propertyValue);
            } else if (typeof propertyValue === 'string') {
                // TODO: Add support later on for date type parsing out of the row object.
                this._generator.addCellString(this._lastRowIndex, columnIndex, propertyValue);
            } else if (typeof propertyValue === 'object') {
                this._generator.addCellDate(this._lastRowIndex, columnIndex, propertyValue);
            }

            if (column in excelOptions.targetedStyles.rowStyles) {
                this._generator.setCellStyle(this._lastRowIndex, columnIndex, excelOptions.targetedStyles.rowStyles[column]);
            }

            columnIndex++;
        });

        this._lastRowIndex++;
    }

    _getColumns(rowObject) {
        if (this._columns.length > 0) {
            return this._columns;
        }

        if (this._options.columnSortArray.length > 0) {
            this._columns = this._options.columnSortArray;
        } else if (this._options.shouldInferColumns) {
            this._columns = _.keys(rowObject);
        } else {
            throw new Error('Unable to write column header because no column sort is provided and columns cannot be inferred.');
        }

        return this._columns;
    }

    _writeHeader(rowObject) {
        const columns = this._getColumns(rowObject);
        let colIndex = 1;

        columns.forEach((columnName) => {
            let normalizedColumnName = columnName;

            if (this._options.headerValueTransformFn !== null) {
                normalizedColumnName = this._options.headerValueTransformFn(columnName);
            }

            this._generator.addCellString(this._lastRowIndex, colIndex, normalizedColumnName)
                .setCellStyle(this._lastRowIndex, colIndex, this._options.targetedStyles.headerStyle);

            colIndex++;
        });

        this._generator.freeze(1);

        this._lastRowIndex++;
    }
}
