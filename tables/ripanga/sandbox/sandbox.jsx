import React from 'react';
import { render } from 'react-dom'; // eslint-disable-line
import Ripanga from '../src';

const def = {
  editable: false,
  hidden: false,
  label: '',
  name: '',
  sortable: false,
  sortKey: ''
};

// TODO examples: ungrouped, ungrouped checkboxes, grouped, grouped checkboxes
const renderCell = (rowData, i) => <td key={`cell-${rowData.key}-${i}`}>{rowData.text}</td>;
const renderBodyRow = (rowData, cells) => <tr key={`row-${rowData.key}`}>{cells}</tr>;
const renderBodyStickyCell = rowData => <div key={`sticky-${rowData.key}`}>Sticky {rowData.text}</div>;

const tableData = [{
  key: undefined,
  data: [
    { text: 'cellA', key: 'cellA' },
    { text: 'cellB', key: 'cellB' },
    { text: 'cellC', key: 'cellC' }
  ] }
];

const columnDefinitions = [
  Object.assign({ def, renderer: renderCell }, { label: 'Cell A', sortKey: 'cellA' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Cell B', sortKey: 'cellB' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Cell C', sortKey: 'cellC' })
];

render(
  <Ripanga
    globalKey='ripanga-sandbox-ungrouped'
    idKey='key'
    {...{
      columnDefinitions,
      renderBodyRow,
      renderBodyStickyCell,
      tableData
    }}
  />,
  document.getElementById('root'),
);
