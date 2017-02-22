import { render } from 'react-dom';
import React from 'react';

import Rapu from '../src';

const onSubmit = () => {
  console.warn("Submitted.");
};

render(
  <Rapu {...{ onSubmit }} />,
  window.document.getElementById('root'),
);
