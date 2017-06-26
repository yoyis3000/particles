import React from 'react';
import { render } from 'react-dom';

import BulkEditor from '../src';

const items = [
  { id: 1, text: 'Item to Edit' },
  { id: 2, text: 'Item to Edit as well' },
  { id: 3, text: 'Another Item to Edit' }
];

const emptyMessage = 'No items being passed in';
const itemFormatter = item => item.text;
const onRemove = item => console.log('Would have removed: ', item); // eslint-disable-line
const onSubmit = ({ ids, fields }) => console.log("ids: ", ids, "field values: ", fields); // eslint-disable-line
const valueField = 'id';

const stylesheets = [];

render(
  <div style={{ margin: '10px' }}>
    <BulkEditor
      {...{
        emptyMessage,
        itemFormatter,
        items,
        onRemove,
        onSubmit,
        stylesheets,
        valueField
      }}
    />
  </div>,
  window.document.getElementById('root')
);
