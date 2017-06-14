import React from 'react';
import { render } from 'react-dom'; // eslint-disable-line

import sandboxStyles from './sandbox.scss';

import Maramataka from '../src';

const onSelect = (value) => {
  console.info('Selected:', value); // eslint-disable-line
};

const value = {
  day: 28,
  month: 2,
  year: 2017
};

const stylesheets = [sandboxStyles];

const onClear = () => console.log('Cleared selected date!'); // eslint-disable-line

render(
  <div>
    <Maramataka
      {...{
        onClear,
        onSelect,
        stylesheets,
        value
      }}
    />
  </div>,
  window.document.getElementById('root')
);
