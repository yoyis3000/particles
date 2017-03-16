import { render } from 'react-dom'; // eslint-disable-line
import React from 'react';

import sandboxStyles from './sandbox.scss';

import Rapu from '../src';

const onSubmit = () => {
  console.warn('Submitted.'); // eslint-disable-line
};

const stylesheets = [sandboxStyles];

render(
  <Rapu {...{ onSubmit, stylesheets }} />,
  window.document.getElementById('root'),
);
