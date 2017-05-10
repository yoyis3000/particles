import React from 'react';
import { render } from 'react-dom';

import sandboxStyles from './sandbox.scss';

import Tukuatu from '../src';

const onComplete = (arr) => {
  console.warn('Files selected:', arr); // eslint-disable-line no-console
};

const slotDrag = <div>Drag and Drop File(s)</div>;
const slotAttach = <div>Attach File(s)</div>;

const stylesheets = [sandboxStyles];

render(
  <Tukuatu
    {...{
      onComplete,
      slotAttach,
      slotDrag,
      stylesheets
    }}
  />,
  window.document.getElementById('root')
);
