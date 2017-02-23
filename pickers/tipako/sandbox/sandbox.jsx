import { render } from 'react-dom';
import React from 'react';

import Tipako from '../src';

import defaultStyles from '../src/TipakoDefault.scss';
import sandboxStyles from './sandbox.scss';

const data = [
  { text: 'Animals',
    id: 100,
    children: [
      { text: 'Dolphin', id: 2 },
      { text: 'Albatross', id: 3 },
      { text: 'German Shepherd', id: 4 },
      { text: 'Mole', id: 5 },
      { text: 'Lesser Southern Floridian Muskrat', id: 6 },
    ],
  },

  { text: 'Woodworking',
    id: 7,
    children: [
      { text: 'Lutherie', id: 8 },
      { text: 'Carpentry', id: 9 },
      { text: 'Parquetry', id: 10 },
      { text: 'Joinery', id: 11 },
      { text: 'Cabinetry', id: 12 },
    ],
  },

  { text: 'Saturnian Moons Found Around Saturn',
    id: 13,
    children: [
      { text: 'Tethys', id: 14 },
      { text: 'Calypso', id: 15 },
      { text: 'Enceladus', id: 16 },
      { text: 'Rhea', id: 17 },
      { text: 'Iapetus', id: 18 },
    ],
  },

  { text: 'An empty group appears!', id: 19, children: [] },

  { text: 'Magnetic', id: 20 },
  { text: 'Guacamole', id: 21 },
  { text: 'Crankshaft', id: 22 },
  { text: 'Demographic', id: 23 },
  { text: 'Almond', id: 24 },
];

const renderTokens = (tokens, onRemove) => {
  console.warn('Using custom token renderer.'); // eslint-disable-line no-console

  return Object.values(tokens).map(t =>
    (<div key={`token-${t.id}`}>
      {t.text}

      <button style={{ marginLeft: '10px' }} onClick={() => onRemove(t)}>
        Remove
      </button>
    </div>));
};

const groupIcon = '/sandbox/icon-group.png';
const itemIcon = '/sandbox/icon-item.png';

// Use this method to customize your call with URIs, query parameters, etc.
const onFetch = (str, callback) => {
  console.warn('Starting API mock response time...'); // eslint-disable-line no-console
  setTimeout(() => {
    console.warn('...finished.'); // eslint-disable-line no-console
    callback(data);
  }, 1000);
};

const onSelect = (selectedItems) => {
  console.warn('The following items have been selected:', selectedItems); // eslint-disable-line no-console
};

const msgEmpty = 'No results!';
const msgPlaceholder = 'Hello world';
const addGroupTokens = true;
const maxResults = 4;
const stylesheets = [
  defaultStyles,
  sandboxStyles,
];

render(
  <Tipako
    {...{
      addGroupTokens,
      data,
      groupIcon,
      itemIcon,
      maxResults,
      msgEmpty,
      msgPlaceholder,
      onFetch,
      onSelect,
      renderTokens,
      stylesheets,
    }}

    className={sandboxStyles.sandbox}
  />,
  window.document.getElementById('root'));
