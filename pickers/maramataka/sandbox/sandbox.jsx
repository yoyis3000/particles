import React from 'react';
import { render } from 'react-dom';

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

render(
  <div>
    <Maramataka
      {...{
        onSelect,
        stylesheets,
        value
      }}
    />
  </div>,
  window.document.getElementById('root')
);
