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

const renderCell = (rowData, i) => <td key={`cell-${rowData.key}-${i}`}>{rowData.text}</td>;
const renderBodyRow = (rowData, cells) => <tr key={`row-${rowData.key}`}>{cells}</tr>;
const renderBodyStickyCell = rowData => <div key={`sticky-${rowData.key}`}>Sticky {rowData.text}</div>;

const tableDataUngrouped = [{
  key: undefined,
  data: [
    { text: 'rowA', key: 'rowA' },
    { text: 'rowB', key: 'rowB' },
    { text: 'rowC', key: 'rowC' }
  ] }
];

const tableDataGrouped = [
  { key: { name: 'groupA' },
    data: [
      { text: 'rowA', key: 'rowA' },
      { text: 'rowB', key: 'rowB' },
      { text: 'rowC', key: 'rowC' }
    ]
  }, { key: { name: 'groupB' },
    data: [
      { text: 'rowD', key: 'rowD' },
      { text: 'rowE', key: 'rowE' },
      { text: 'rowF', key: 'rowF' },
      { text: 'rowG', key: 'rowG' }
    ]
  }, { key: { name: 'groupC' },
    data: [
      { text: 'rowH', key: 'rowH' },
      { text: 'rowI', key: 'rowI' },
      { text: 'rowJ', key: 'rowJ' },
      { text: 'rowK', key: 'rowK' }
    ]
  }
];

const columnDefinitions = [
  Object.assign({ def, renderer: renderCell }, { label: 'Col A', sortKey: 'colA' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col B', sortKey: 'colB' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col C', sortKey: 'colC' })
];

// TODO examples: WITH and WITHOUT
// grouping
// checkboxes
// group title render
// body row render
// empty render

const ungrouped = (<Ripanga
  globalKey='ripanga-sandbox-ungrouped'
  idKey='key'
  tableData={tableDataUngrouped}
  {...{
    columnDefinitions,
    renderBodyRow,
    renderBodyStickyCell
  }}
/>);

const grouped = (<Ripanga
  globalKey='ripanga-sandbox-grouped'
  idKey='key'
  tableData={tableDataGrouped}
  {...{
    columnDefinitions,
    renderBodyRow,
    renderBodyStickyCell
  }}
/>);

render(
  <div>
    {grouped}
  </div>,
  document.getElementById('root'),
);
