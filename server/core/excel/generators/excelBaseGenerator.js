import excel from 'excel4node';
import { randomUUID } from 'crypto';

const ExcelFileExtension = 'xlsx';
const ExcelCellValueTypes = Object.freeze({
   Number: Symbol('ExcelNumber'),
   Formula: Symbol('ExcelFormula'),
   String: Symbol('ExcelString'),
   Boolean: Symbol('ExcelBoolean'),
   Date: Symbol('ExcelDate'),
});

export default class ExcelBaseGenerator {
    constructor(excelOptions) {
        this._excelOptions = excelOptions;
        this._workbook = new excel.Workbook();
        this._worksheets = new Map();
        this._cellValues = new Map();
        this._cellTypes = new Map();
        this._tracking = {
            lastRow: 0,
            lastColumn: 0,
            lastSheet: null,
        };
    }

    addWorksheet(worksheetName) {
        if (!this._worksheets.has(worksheetName)) {
            this._worksheets.set(worksheetName, this._workbook.addWorksheet(worksheetName));
        }
        return this;
    }

    addCellNumber(row, column, value) {
        const ws = this._getCurrentWorksheet();
        ws.cell(row, column).number(value).style(this._excelOptions.style);
        this._trackValueChange(row, column, value, ExcelCellValueTypes.Number);
        return this;
    }

    addCellFormula(row, column, value) {
        const ws = this._getCurrentWorksheet();
        ws.cell(row, column).formula(value).style(this._excelOptions.style);
        this._trackValueChange(row, column, value, ExcelCellValueTypes.Formula);
        return this;
    }

    addCellString(row, column, value) {
        const ws = this._getCurrentWorksheet();
        ws.cell(row, column).string(value).style(this._excelOptions.style);
        this._trackValueChange(row, column, value, ExcelCellValueTypes.String);
        return this;
    }

    addCellBool(row, column, value) {
        const ws = this._getCurrentWorksheet();
        ws.cell(row, column).bool(value).style(this._excelOptions.style);
        this._trackValueChange(row, column, value, ExcelCellValueTypes.Boolean);
        return this;
    }

    addCellDate(row, column, value) {
        const ws = this._getCurrentWorksheet();
        ws.cell(row, column).date(value).style(this._excelOptions.style);
        this._trackValueChange(row, column, value, ExcelCellValueTypes.Date);
        return this;
    }

    freeze(rowToFreeze) {
        const ws = this._getCurrentWorksheet();
        ws.row(rowToFreeze).freeze();
        return this;
    }

    createStyle(styleOptions) {
        return this._workbook.createStyle(styleOptions);
    }

    setCellStyle(row, column, cellStyle) {
        const ws = this._getCurrentWorksheet();
        const cell = ws.cell(row, column);
        const refName = this._getCellValueRefName(this._tracking.lastSheet, row, column);
        const refValue = this._getCellValueRefValue(refName);

        const symbolType = this._cellTypes.get(refName);
        switch (symbolType) {
            case ExcelCellValueTypes.Boolean: cell.bool(Boolean(refValue)).style(cellStyle); break;
            case ExcelCellValueTypes.String: cell.string(String(refValue)).style(cellStyle); break;
            case ExcelCellValueTypes.Formula: cell.formula(refValue).style(cellStyle); break;
            case ExcelCellValueTypes.Number: cell.number(Number(refValue)).style(cellStyle); break;
            case ExcelCellValueTypes.Date: cell.date(new Date(refValue)).style(cellStyle); break;
            default: cell.string(String(refValue)).style(cellStyle); break;
        }

        return this;
    }

    setCurrentSheet(worksheetName) {
        if (worksheetName !== undefined && worksheetName !== null && this._worksheets.has(worksheetName)) {
            this._updateTracking(worksheetName || this._excelOptions.defaultSheetName);
        }
    }

    getExcelOptions() {
        return this._excelOptions;
    }

    getExcelRowCol(rowCol) {
        return excel.getExcelRowCol(rowCol);
    }

    getExcelCellRef(row, column) {
        return excel.getExcelCellRef(row, column);
    }

    getExcelTimestamp(dateObject) {
        return excel.getExcelTS(dateObject);
    }

    writeToFileSystem(fileName) {
        this._workbook.write(this._getExcelFileName(fileName));
    }

    writeToResponseStream(fileName, stream) {
        this._workbook.write(this._getExcelFileName(fileName), stream);
    }

    writeToMemoryBuffer() {
        return new Promise((resolve, reject) => {
            this._workbook.writeToBuffer().then((buffer) => {
                resolve(buffer);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    _getCurrentWorksheet() {
        const normalizedSheetName = this._tracking.lastSheet ?? this._excelOptions.defaultSheetName;
        this._updateTracking({
            sheet: normalizedSheetName,
        });
        this.addWorksheet(normalizedSheetName);
        return this._worksheets.get(normalizedSheetName);
    }

    _getCellValueRefName(worksheetName, row, column) {
        return `${worksheetName.replace(' ', '_')}_${this.getExcelCellRef(row, column)}`;
    }

    _getCellValueRefValue(refName) {
        return this._cellValues.get(refName);
    }

    _getExcelFileName(fileName) {
        if (fileName === undefined || fileName === null) {
            return `${randomUUID()}.${ExcelFileExtension}`;
        }

        if (fileName.indexOf(`.${ExcelFileExtension}`) === -1) {
            return `${fileName}.${ExcelFileExtension}`;
        }

        return fileName;
    }

    _trackValueChange(row, column, value, symbolType) {
        const refName = this._getCellValueRefName(this._tracking.lastSheet, row, column);
        if (!this._cellValues.has(refName)) {
            this._cellValues.set(refName, value);
            this._cellTypes.set(refName, symbolType);
        } else {
            this._cellValues[refName] = value;
        }
    }

    _updateTracking(trackingObject) {
        if (trackingObject.sheet) {
            this._tracking.lastSheet = trackingObject.sheet;
        }
        if (trackingObject.row) {
            this._tracking.lastRow = trackingObject.row;
        }
        if (trackingObject.col) {
            this._tracking.lastColumn = trackingObject.col;
        }
    }
}
