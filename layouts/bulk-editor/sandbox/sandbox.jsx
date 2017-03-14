import React from 'react';
import { render } from 'react-dom';
import sandboxStyles from './sandbox.scss';

import BulkEditor, { DatePicker, Input, Picker } from '../src';

const items = ['1: Item to Edit', '2: Item to Edit as well'];
const stylesheets = [sandboxStyles];

render(
  <div style={{ margin: '10px' }}>
    <BulkEditor {...{ items, stylesheets }}>
      <Picker label='First' inputName='picker1' />
      <Picker label='Second' inputName='picker2' />
      <Input label='Third' inputName='input1' />
      <Input label='Fourth' inputName='input2' type='number' placeholder='In Days' />
      <DatePicker label='Fifth' inputName='DatePicker1' placeholder='mm/dd/yy' />
    </BulkEditor>
  </div>,
  window.document.getElementById('root')
);
