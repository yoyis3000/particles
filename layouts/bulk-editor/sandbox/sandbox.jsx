import React from 'react';
import { render } from 'react-dom';
import sandboxStyles from './sandbox.scss';

import BulkEditor, { DatePicker, Input, Select } from '../src';

const items = ['1: Item to Edit', '2: Item to Edit as well'];
const stylesheets = [sandboxStyles];

render(
  <div style={{ margin: '10px' }}>
    <BulkEditor {...{ items, stylesheets }}>
      <Select label='First' inputName='select1' />
      <Select label='Second' inputName='select2' />
      <Input label='Third' inputName='input1' />
      <Input label='Fourth' inputName='input2' type='number' placeholder='In Days' />
      <DatePicker label='Fifth' inputName='DatePicker1' placeholder='mm/dd/yy' />
    </BulkEditor>
  </div>,
  window.document.getElementById('root')
);
