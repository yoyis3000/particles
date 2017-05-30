import React from 'react';
import { render } from 'react-dom';

import sandboxStyles from './sandbox.scss';
//
import Tauwahi from '../src';

const data = [
  {
    id: 1,
    parent_id: null,
    name: 'United States',
    full_name: 'United States'
  },
  {
    id: 2,
    parent_id: null,
    name: 'New Zealand',
    full_name: 'New Zealand'
  },
  {
    id: 3,
    parent_id: 1,
    name: 'California',
    full_name: 'United States>California'
  },
  {
    id: 4,
    parent_id: 1,
    name: 'Oregon',
    full_name: 'United States>Oregon'
  },
  {
    id: 5,
    parent_id: 2,
    name: 'Manawatu',
    full_name: 'New Zealand>Manawatu'
  },
  {
    id: 6,
    parent_id: 2,
    name: 'Auckland',
    full_name: 'New Zealand>Auckland'
  }
];

// const onSelect = (value) => {
//   console.warn(`Selected '${value}'.`); // eslint-disable-line no-console
// };
//
// const title = 'Export';
//
// const stylesheets = [];

function onSelect(item) {
  console.warn('An item was selected', item);
}

const canAdd = true;

render(
  <Tauwahi
    {...{
      canAdd,
      data,
      onSelect,
      stylesheets: []
    }}
  />,
  window.document.getElementById('root')
);
