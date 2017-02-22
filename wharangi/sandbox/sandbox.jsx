import { render } from 'react-dom';
import React from 'react';

import Wharangi from '../src';

const onSelect = () => {
  console.warn('A page was selected.'); // eslint-disable-line no-console
};

const pagesToShow = 3;
const perPage = 10;
const totalRecords = 39;

render(
  <Wharangi
    {...{
      onSelect,
      pagesToShow,
      perPage,
      totalRecords,
    }}
  />,
  window.document.getElementById('root'),
);
