import React from 'react';
import { render } from 'react-dom'; // eslint-disable-line
import Ripanga from '../src';
import sandboxStyles from './sandbox.scss';

const def = {
  editable: false,
  hidden: false,
  label: '',
  key: '',
  sortable: false,
  sortKey: '',
  width: 100
};

const onSort = () => { console.warn("Column was sorted."); };

const tableDataUngrouped = [{
  key: undefined,
  data: [
    { text: 'rowA', key: 'rowA' },
    { text: 'rowB', key: 'rowB' },
    { text: 'rowC', key: 'rowC' }
  ] }
];

const tableDataGrouped = [
  { key: { key: 'groupA', label: 'groupA' },
    data: [
      { text: 'rowA', key: 'rowA' },
      { text: 'rowB', key: 'rowB' },
      { text: 'rowC', key: 'rowC' }
    ]
  }, { key: { key: 'groupB', label: 'groupB' },
    data: [
      { text: 'rowD', key: 'rowD' },
      { text: 'rowE', key: 'rowE' },
      { text: 'rowF', key: 'rowF' },
      { text: 'rowG', key: 'rowG' }
    ]
  }, { key: { key: 'groupC', label: 'groupC' },
    data: [
      { text: 'rowH', key: 'rowH' },
      { text: 'rowI has too much text. Why would there be multiple lines of text in a table cell? Surely there is a good reason.', key: 'rowI' },
      { text: 'rowJ', key: 'rowJ' },
      { text: 'rowK', key: 'rowK' }
    ]
  }
];

const renderBodyCell = (rowData, def) => <div key={`cell-${rowData.key}-${def.key}`}>{rowData.text}</div>;

const renderBodyRow = (rowData, cells) => <div key={`row-${rowData.key}`}>{cells}</div>;
const renderBodyStickyCell = rowData => <div>Sticky {rowData.text}</div>;
const renderGroupStickyCell = groupData => <div>Sticky Group {groupData.key.name}</div>;
const renderHeadStickyCell = () => <div>Sticky Head</div>;

const columnDefinitions = [
  Object.assign({ ...def }, { label: 'Col A', key: 'colA', width: 200 }),
  Object.assign({ ...def }, { label: 'Col B', key: 'colB', width: 200 }),
  Object.assign({ ...def }, { label: 'Col C', key: 'colC' })
];

const groupedWithCheckboxes = (<Ripanga
  globalKey='ripanga-sandbox-grouped'
  idKey='key'
  showCheckboxes
  tableData={tableDataGrouped}
  {...{
    columnDefinitions,
    onSort,
    renderBodyRow,
    renderBodyCell,
    renderBodyStickyCell,
    renderGroupStickyCell,
    renderHeadStickyCell,
    stylesheets: [sandboxStyles]
  }}
/>);

render(
  <div className={sandboxStyles.tableContainer}>
    <button
      className={sandboxStyles.btnUncheck}
      onClick={() => { window.dispatchEvent(new CustomEvent('uncheck')); }}
    >
      Uncheck All
    </button>

    {groupedWithCheckboxes}
  </div>,
  document.getElementById('root'),
);
