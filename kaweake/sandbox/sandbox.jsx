import React from 'react';
import { render } from 'react-dom';

import Kaweake from '../src';

const options = [
  {name: 'CSV', format: 'csv'},
  {name: 'PDF', format: 'pdf'},
  {name: 'Excel', format: 'xlsx'},
];

const generateEndpoint = (format) => {
  const baseUrl = `${window.location.origin + window.location.pathname}.`;
  return `${baseUrl}${format}${window.location.search}`;
};

render(
  <Kaweake
    {...{
      options,
      generateEndpoint,
    }}
  />,
  window.document.getElementById('root'));
