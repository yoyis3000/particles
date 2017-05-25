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

    <Kaweake
      {...{
        data,
        icon,
        onSelect,
        stylesheets,
        title
      }}
    />
  </div>,
  window.document.getElementById('root')
);
