import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export default class ApplicationDataViewerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.tableName = `rdvc-${uuidv4()}`;
    this.applicationDataHeaderColumns = this.props.applicationDataHeaderColumns || [];
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
    const headers = this.applicationDataHeaderColumns;

    if (this.props.data.length === 0) {
        return [];
    }

      if (this.applicationDataHeaderColumns.length === 0) {
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
    const columnDataArray = [];
    for (let i = 0; i < columnHeaders.length; ++i) {
        let columnValue = '';

        if (this.props.data.appData.hasOwnProperty(columnHeaders[i].key) && this.props.data.appData[columnHeaders[i].key] !== null) {
            columnValue = this.props.data.appData[columnHeaders[i].key].toString();
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

ApplicationDataViewerComponent.propTypes = {
  applicationDataHeaderColumns: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
