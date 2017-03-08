import React from 'react';
import { render } from 'react-dom';

import BulkEditor from '../src';

const items = ['Item1', 'Item2'];

render(
  <div style={{ margin: '10px' }}>
    <BulkEditor {...{ items }} />
  </div>,
  window.document.getElementById('root')
);
