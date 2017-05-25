import React from 'react';
import { render } from 'react-dom';
import CrudPermissionsTable from '../src';
import sandboxStyles from './sandbox.scss';

const onCheck = (update) => {
  console.warn('A checkbox has been selected.', update); // eslint-disable-line
};


const onGroupCheck = (update) => {
  console.warn('A group has been selected.', update); // eslint-disable-line
};

const headData = [
  { label: 'Tools', id: 'tools' },
  { label: 'Create', id: 'create' },
  { label: 'Update', id: 'update' },
  { label: 'Delete', id: 'delete' }
];

const bodyData = [
  {
    key: { id: 'budget', label: 'Budget' },
    data: [
      { label: 'Budget Line Items', id: 0, create: false, update: true, delete: false, uneditableOptions: ['create', 'delete'] },
      { label: 'Budget Modifications', id: 1, create: false, update: true, delete: true, uneditableOptions: ['create'] },
      { label: 'Budget', id: 10, create: false, update: false, delete: false, uneditableOptions: ['create', 'update'] }
    ]
  },

  {
    key: { id: 'change_events', label: 'Change Events' },
    data: [
      { label: 'Change Events', id: 2, create: true, update: false, delete: false, uneditableOptions: ['update', 'delete'] },
      { label: 'Change Types', id: 3, create: true, update: false, delete: false, uneditableOptions: ['update'] },
      { label: 'Change Change', id: 11, create: false, update: false, delete: false, uneditableOptions: ['update', 'create'] }
    ]
  },

  {
    key: { id: 'change_orders', label: 'Change Orders' },
    data: [
      { label: 'Change Order Foo', id: 4, create: true, update: true, delete: false, uneditableOptions: ['delete'] },
      { label: 'Change Order Bar', id: 5, create: false, update: true, delete: false, uneditableOptions: ['create', 'delete'] },
      { label: 'Change Order Baz', id: 6, create: false, update: false, delete: false, uneditableOptions: ['update', 'delete'] }
    ]
  },
  {
    key: { id: 'commitments', label: 'Commitments' },
    data: [
      { label: 'Commitment', id: 12, create: false, update: true, delete: false, uneditableOptions: ['delete'] }
    ]
  }
];

const stylesheets = [sandboxStyles];

render(

  <div>
    <div className={[sandboxStyles.sectionTitle]}>Financials</div>
    <CrudPermissionsTable {...{ bodyData, headData, onCheck, onGroupCheck, stylesheets }} />
    <div className={[sandboxStyles.sectionTitle]}>Project Management</div>
    <CrudPermissionsTable {...{ bodyData, headData, onCheck, onGroupCheck, stylesheets }} />
  </div>,
  window.document.getElementById('root')
);
