/* eslint-disable import/no-extraneous-dependencies */
import { render } from 'react-dom';
import React from 'react';

import ColumnOrganizer from '../src';

import sandboxStyles from './sandbox.scss';

const renderCell = (rowData, i) => <td key={`cell-${rowData.key}-${i}`}>{rowData.text}</td>;

const def = {
  editable: false,
  hidden: false,
  key: '',
  label: '',
  locked: false,
  renderer: renderCell,
  sortable: false,
  sortKey: ''
};

const columns = [
  Object.assign({}, def, { label: 'Col A', key: 'colA' }),
  Object.assign({}, def, { label: 'Col B', key: 'colB' }),
  Object.assign({}, def, { label: 'Col C', key: 'colC' }),
  Object.assign({}, def, { label: 'Col D', key: 'colD' }),
  Object.assign({}, def, { label: 'Col E', key: 'colE' }),
  Object.assign({}, def, { label: 'Col F', key: 'colF' }),
  Object.assign({}, def, { label: 'Col G with a very long name that will probably wrap if given the chance', key: 'colG' }),
  Object.assign({}, def, { label: 'Col H', key: 'colH' }),
  Object.assign({}, def, { label: 'Col I', key: 'colI' }),
  Object.assign({}, def, { label: 'Col J', key: 'colJ' }),
  Object.assign({}, def, { label: 'Col K', key: 'colK' }),
  Object.assign({}, def, { label: 'Col L', key: 'colL' }),
  Object.assign({}, def, { label: 'Col M', key: 'colM' }),
  Object.assign({}, def, { label: 'Col N', key: 'colN' }),
  Object.assign({}, def, { label: 'Col O', key: 'colO' }),
  Object.assign({}, def, { label: 'Col P', key: 'colP' }),
  Object.assign({}, def, { label: 'Col Q', key: 'colQ' })
];

const defaultColumns = columns;

const onChange = (newColumnDefinitions) => {
  console.warn(newColumnDefinitions); // eslint-disable-line
};

const stylesheets = [sandboxStyles];

const lockLimit = 3;

render(
  <ColumnOrganizer
    {...{
      columns,
      defaultColumns,
      lockLimit,
      onChange,
      stylesheets
    }}
  />,
  window.document.getElementById('root')
);
