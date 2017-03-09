import React from 'react';
import { render } from 'react-dom';
import sandboxStyles from './sandbox.scss';

import BulkEditor, { Select } from '../src';

const items = ['1: Item to Edit', '2: Item to Edit as well'];
const stylesheets = [sandboxStyles];

render(
  <div style={{ margin: '10px' }}>
    <BulkEditor {...{ items, stylesheets }}>
      <div>
        <Select inputName='select1' />
        <Select inputName='select2' />
      </div>
    </BulkEditor>
  </div>,
  window.document.getElementById('root')
);
