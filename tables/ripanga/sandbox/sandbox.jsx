import React from 'react';
import { render } from 'react-dom'; // eslint-disable-line
import Ripanga from '../src';
import Tiwae from 'tiwae';

import defaultStyles from '../src/RipangaDefault.scss';
import sandboxStyles from './sandbox.scss';
import tiwaeOverrides from './TiwaeOverrides.scss';

const def = {
  editable: false,
  hidden: false,
  label: '',
  key: '',
  sortable: false,
  sortKey: ''
};

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

const renderCell = (rowData, i) => <td key={`cell-${rowData.key}-${i}`}>{rowData.text}</td>;
const renderBodyRow = (rowData, cells) => <tr key={`row-${rowData.key}`}>{cells}</tr>;
const renderBodyStickyCell = rowData => <td key={`sticky-${rowData.key}`} className={sandboxStyles.sticky}>Sticky {rowData.text}</td>;

const columnDefinitions = [
  Object.assign({ def, renderer: renderCell }, { label: 'Col A', key: 'colA' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col B', key: 'colB' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col C', key: 'colC' })
];

const onChange = (newDefs) => {
  console.warn(newDefs)

  const test = (<Ripanga
    globalKey='ripanga-sandbox-grouped'
    idKey='key'
    showCheckboxes
    tableData={tableDataGrouped}
    {...{
      columnDefinitions: newDefs,
      renderBodyRow,
      renderBodyStickyCell,
      renderHeadStickyCell,
      stylesheets
    }}
  />);

  render(
    <div>
      {test}
    </div>,
    document.getElementById('root'),
  );
}

const renderHeadStickyCell = (def) => (<th className={sandboxStyles.sticky} key='sticky-head'>
  <Tiwae options={columnDefinitions} onChange={onChange} stylesheets={[tiwaeOverrides]} />
</th>);

const stylesheets = [
  defaultStyles,
  sandboxStyles
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
    renderBodyStickyCell,
    stylesheets
  }}
/>);

const grouped = (<Ripanga
  globalKey='ripanga-sandbox-grouped'
  idKey='key'
  tableData={tableDataGrouped}
  {...{
    columnDefinitions,
    renderBodyRow,
    renderBodyStickyCell,
    renderHeadStickyCell,
    stylesheets
  }}
/>);

const groupedWithCheckboxes = (<Ripanga
  globalKey='ripanga-sandbox-grouped'
  idKey='key'
  showCheckboxes
  tableData={tableDataGrouped}
  {...{
    columnDefinitions,
    renderBodyRow,
    renderBodyStickyCell,
    renderHeadStickyCell,
    stylesheets
  }}
/>);

render(
  <div>
    {groupedWithCheckboxes}
  </div>,
  document.getElementById('root'),
);
