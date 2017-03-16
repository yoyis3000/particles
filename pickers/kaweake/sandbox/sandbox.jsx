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

const title = 'Export';

const stylesheets = [sandboxStyles];

render(
  <Kaweake
    {...{
      data,
      icon,
      onSelect,
      title,
      stylesheets
    }}
  />,
  window.document.getElementById('root')
);
