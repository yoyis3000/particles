import { render } from 'react-dom';
import React from 'react';

import ColumnOrganizer from '../src';

import sandboxStyles from './sandbox.scss';

const def = {
  editable: false,
  hidden: false,
  label: '',
  name: '',
  sortable: false,
  sortKey: ''
};

const renderCell = (rowData, i) => <td key={`cell-${rowData.key}-${i}`}>{rowData.text}</td>;

const columnDefinitions = [
  Object.assign({ def, renderer: renderCell }, { label: 'Col A', name: 'colA' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col B', name: 'colB' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col C', name: 'colC' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col D', name: 'colD' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col E', name: 'colE' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col F', name: 'colF' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col G with a very long name that will probably wrap if given the chance', name: 'colG' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col H', name: 'colH' }),
  Object.assign({ def, renderer: renderCell }, { label: 'Col I', name: 'colI' })
];

const onChange = (newColumnDefinitions) => {
  console.warn(newColumnDefinitions); // eslint-disable-line
};

const stylesheets = [sandboxStyles];

const lockLimit = 3;

render(
  <ColumnOrganizer
    {...{
      lockLimit,
      onChange,
      options: columnDefinitions,
      stylesheets
    }}
  />,
  window.document.getElementById('root')
);
