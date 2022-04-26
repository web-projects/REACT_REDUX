import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export default class DeviceDataViewerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.tableName = `rdvc-${uuidv4()}`;
    this.deviceDataHeaderColumns = this.props.deviceDataHeaderColumns || [];
  }

  componentDidMount() {
    $(document).ready(() => {
        $(`#${this.tableName}`).DataTable({
          scrollX: true,
          paging: false,
          ordering: false,
          info: false,
          searching: false,
        });
    });
  }

  createHeaderColumns() {
    const headers = this.deviceDataHeaderColumns;

    if (this.props.data.length === 0) {
        return [];
    }

    if (this.deviceDataHeaderColumns.length === 0) {
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

  createTableHeadContents(columnHeaders) {
    const tableHeadContents = [];

    for (let ndx = 0; ndx < columnHeaders.length; ++ndx) {
        tableHeadContents.push((
          <th className="th-sm">
            {columnHeaders[ndx].name}
          </th>
        ));
    }

    return tableHeadContents;
  }

  createTableRowContents(columnHeaders) {
    const tableRowContents = [];
    const columnDataArray = [];

    // ToDo: different layout
    /*
    for (let i = 0; i < columnHeaders.length; ++i) {
        let columnValue = 'missing key';

        if (this.props.data.deviceData.hasOwnProperty(columnHeaders[i].key)) {
            columnValue = this.props.data.deviceData[columnHeaders[i].key];
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
    */

    const workingRows = [];
    const singleRowObject = this.props.data.deviceData;
    Object.keys(singleRowObject).forEach((key) => {
      workingRows.push({
            name: key,
            value: this.props.data.deviceData[key],
        });
    });
    // console.log(workingRows);

    for (let i = 0; i < workingRows.length; ++i) {
        if (workingRows[i].value.toString().length > 0) {
          columnDataArray.push((
            <td>
              {workingRows[i].name}
            </td>
          ));
          columnDataArray.push((
            <td>
              {workingRows[i].value.toString()}
            </td>
          ));
        }
    }
    // console.log(columnDataArray);

    for (let i = 0; i < columnDataArray.length; i += 2) {
      tableRowContents.push((
        <tr>
          {columnDataArray[i]}
          {columnDataArray[i + 1]}
        </tr>
      ));
    }

    // console.log(tableRowContents);

    return tableRowContents;
  }

  render() {
    const columnHeaders = this.createHeaderColumns();

    // Build the rendered output of the table headers.
    const tableHeadContents = this.createTableHeadContents(columnHeaders);

    // Build the rendered output of the table rows.
    const tableRowContents = this.createTableRowContents(columnHeaders);

    return (
      <table id={this.tableName} className="table table-striped table-bordered table-sm" cellSpacing={0} width="100%">
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
}

DeviceDataViewerComponent.propTypes = {
  deviceDataHeaderColumns: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
