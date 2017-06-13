import React from 'react';
import { render } from 'react-dom';

import BulkEditor from '../src';

const items = [
  { id: 1, text: 'Item to Edit' },
  { id: 2, text: 'Item to Edit as well' },
  { id: 3, text: 'Another Item to Edit' }
];

const itemFormatter = item => item.text;
const valueField = 'id';
const onSubmit = ({ ids, fields }) => console.log("ids: ", ids, "field values: ", fields); // eslint-disable-line
const onRemove = item => console.log('Would have removed: ', item); // eslint-disable-line

const stylesheets = [];

render(
  <div style={{ margin: '10px' }}>
    <BulkEditor {...{ onSubmit, items, stylesheets, itemFormatter, onRemove, valueField }} />
  </div>,
  window.document.getElementById('root')
);
