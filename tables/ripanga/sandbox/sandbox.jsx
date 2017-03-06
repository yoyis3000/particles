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

const renderer = obj => <td>{obj.text}</td>;

const tableData = [{
  key: undefined,
  data: [
    { text: 'cellA', key: 'cellA' },
    { text: 'cellB', key: 'cellB' },
    { text: 'cellC', key: 'cellC' }
  ] }
];

const columnDefinitions = [
  Object.assign({ def, renderer }, { label: 'Cell A' }),
  Object.assign({ def, renderer }, { label: 'Cell B' }),
  Object.assign({ def, renderer }, { label: 'Cell C' })
];

render(
  <Ripanga
    columnDefinitions={columnDefinitions}
    idKey='key'
    tableData={tableData}
  />,
  document.getElementById('root'),
);
