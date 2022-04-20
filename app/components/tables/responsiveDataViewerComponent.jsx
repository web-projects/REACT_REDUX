import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ResponsiveBaseComponent from '../responsiveBaseComponent.jsx';

export default class ResponsiveDataViewerComponent extends ResponsiveBaseComponent {
    constructor(props) {
        super(props);
        this.tableName = `rdvc-${uuidv4()}`;
        this.enableSearch = this.props.enableSearch || true;
        this.enableSort = this.props.enableSort || true;
        this.enablePagination = this.props.enablePagination || true;
        this.showPageEntriesLabel = this.props.showPageEntriesLabel || true;
        this.pageSize = this.props.pageSize || 10;
        this.headerColumns = this.props.headerColumns || [];
        this.headerSortFields = this.props.headerColumns || [];
        this.defaultSortField = this.props.defaultSortField || null;
        this.fieldTypes = this.props.fieldTypes || new Map();
    }

    componentDidUpdate() {
        $(document).ready(() => {
            $(`#${this.tableName}`).DataTable();
            $('.dataTables_length').addClass('bs-select');
        });
    }

    createHeaderColumns() {
        const headers = this.headerColumns;

        // TODO: Consider the case where we may want to display "No data Found".
        if (this.props.data.length === 0) {
            return [];
        }

        if (this.headerColumns.length === 0) {
            const singleRowObject = this.props.data[0];
            Object.keys(singleRowObject).forEach((item) => {
                headers.push({
                    name: item,
                    key: item,
                });
            });
        }

        return headers;
    }

    render() {
        if (this.props.fetching || !this.props.isLoaded) {
            return super.renderLoader();
        }

        const columnHeaders = this.createHeaderColumns();

        // Build the rendered output of the table headers.
        const tableHeadContents = [];
        for (let ndx = 0; ndx < columnHeaders.length; ++ndx) {
            tableHeadContents.push((
                <th className="th-sm">
                    {columnHeaders[ndx].name}
                </th>
            ));
        }

        // Build the rendered output of the table rows.
        const tableRowContents = [];
        for (let idx = 0; idx < this.props.data.length; ++idx) {
            const columnDataArray = [];
            for (let j = 0; j < columnHeaders.length; ++j) {
                let columnValue = 'missing key';

                if (this.props.data[idx].hasOwnProperty(columnHeaders[j].key)) {
                    columnValue = this.props.data[idx][[columnHeaders[j].key]].toString();

                    if (this.fieldTypes.has(columnHeaders[j].key)) {
                        // console.log(`index = ${j}`);
                        // console.log(`key= ${columnHeaders[j].key}`);
                        // console.log(`value= ${columnValue}`);
                        // const element = this.fieldTypes.get(columnHeaders[j].key);
                        // console.log(element);
                        // columnValue = this.buildCustomFieldType(element.callback, columnValue);
                        columnValue = this.buildCustomFieldType(this.fieldTypes.get(columnHeaders[j].key), columnValue);
                    }
                }
                columnDataArray.push((
                    <td>
                        {columnValue}
                    </td>
                ));
            }

            tableRowContents.push((
                <tr>
                    {columnDataArray}
                </tr>
            ));
        }

        return (
            <table id={this.tableName} className="table table-striped table-bordered table-sm"
                cellSpacing={0} width="100%">
                    <thead>
                        <tr>
                            {tableHeadContents}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRowContents}
                    </tbody>
            </table>
        );
    }

    buildCustomFieldType(callbackFn, columnValue) {
        // ToDo: assume this is a link
        return (
            <a onClick={() => {
                callbackFn(columnValue);
            }} href="javascript:void(0)">Click Here</a>
        );
    }
}
