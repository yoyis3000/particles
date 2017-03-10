import React from 'react';
import { render } from 'react-dom';
import CrudPermissionsTable from '../src';
import sandboxStyles from './sandbox.scss';

const onCheck = () => {
  console.warn('A checkbox has been selected.'); // eslint-disable-line
};

const headData = [
  { label: "Tools", id: 'tools' },
  { label: "Create", id: 'create' },
  { label: "Modify", id: 'modify' },
  { label: "Delete", id: 'delete' }
];

const bodyData = [
  {
    key: { id: 'budget', label: 'Budget' },
    data: [
      { label: 'Budget Line Items', id: 0, create: true, modify: true, delete: true },
      { label: 'Budget Modifications', id: 1, create: false, modify: true, delete: false }
    ]
  },

  {
    key: { id: 'change_events', label: 'Change Events' },
    data: [
      { label: 'Change Events', id: 2, create: true, modify: true, delete: true },
      { label: 'Change Types', id: 3, create: true, modify: false, delete: false }
    ]
  },

  {
    key: { id: 'change_orders', label: 'Change Orders' },
    data: [
      { label: 'Change Order Foo', id: 4, create: true, modify: false, delete: true },
      { label: 'Change Order Bar', id: 5, create: false, modify: true, delete: true }
    ]
  }
];

const stylesheets = [sandboxStyles];

render(
  <CrudPermissionsTable {...{ bodyData, headData, onCheck, stylesheets }} />,
  window.document.getElementById('root')
);
