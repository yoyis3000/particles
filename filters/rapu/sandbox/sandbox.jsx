import { render } from 'react-dom';
import React from 'react';

import defaultStyles from '../src/RapuDefault.scss';
import sandboxStyles from './sandbox.scss';

import Rapu from '../src';

const onSubmit = () => {
  console.warn('Submitted.'); // eslint-disable-line
};

const stylesheets = [
  defaultStyles,
  sandboxStyles
];

render(
  <Rapu {...{ onSubmit, stylesheets }} />,
  window.document.getElementById('root'),
);
