import React from 'react';
import { render } from 'react-dom';

import sandboxStyles from './sandbox.scss';

import Kaweake from '../src';

const icon = 'icon.svg';

const data = [
  { text: 'CSV', value: 'csv' },
  { text: 'PDF', value: 'pdf' },
  { text: 'Excel', value: 'xlsx' }
];

const onSelect = (value) => {
  console.warn(`Selected '${value}'.`); // eslint-disable-line no-console
};

const selectedValue = 'pdf';
const stylesheets = [sandboxStyles];
const title = 'Export';

render(
  <div>
    <h1>Kaweake is deprecated. Please use Tipako instead.</h1>
    <Kaweake
      {...{
        data,
        icon,
        onSelect,
        selectedValue,
        stylesheets,
        title
      }}
    />
  </div>,
  window.document.getElementById('root')
);
