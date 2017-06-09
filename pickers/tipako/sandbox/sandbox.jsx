/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import { render } from 'react-dom';
import React from 'react';

import Tipako from '../src';
import sandboxStyles from './sandbox.scss';

const data = [
  { value: 'Animals',
    key: 100,
    disabled: true,
    children: [
      { value: 'Dolphin', key: 2, disabled: true },
      { value: 'Albatross', key: 3 },
      { value: 'German Shepherd', key: 4 },
      { value: 'Mole', key: 5 },
      { value: 'Lesser Southern Floridian Muskrat', key: 6 }
    ]
  },

  {
    children: [
      { value: 'Lutherie', key: 8 },
      { value: 'Carpentry', key: 9 },
      { value: 'Parquetry', key: 10 },
      { value: 'Joinery', key: 11 },
      { value: 'Cabinetry', key: 12 }
    ],
    key: 7,
    value: 'Woodworking'
  },

  {
    children: [
      { value: 'Tethys', key: 14 },
      { value: 'Calypso', key: 15 },
      { value: 'Enceladus', key: 16 },
      { value: 'Rhea', key: 17 },
      { value: 'Iapetus', key: 18 }
    ],
    key: 13,
    value: 'Saturnian Moons Found Around Saturn'
  },

  { value: 'An empty group appears!', key: 19, children: [] },

  { value: 'Magnetic poles are points to and from which the lines of magnetic force are directed.', key: 20, disabled: true },
  { value: 'Guacamole', key: 21 },
  { value: 'Crankshaft', key: 22 },
  { value: 'Demographic', key: 23 },
  { value: 'Almond', key: 24 }
];

const loading = false;
const searchable = false;
const closeOnSelect = false;

const onClearAll = () => { console.warn('Clear all.'); };
const onSearch = (str) => { console.warn('Searching for', str); };
const onSelect = (item) => { console.warn('Selected', item); };
const onSelectAll = () => { console.warn('Select all.'); };

const renderEmpty = () => 'Empty!';
const renderGroup = group => group.value;
const renderItem = item => item.value;

const stylesheets = [sandboxStyles];

const keyField = 'key';
const valueField = 'value';
const titleValue = 'Calypso';
const titlePlaceholder = 'Make a selection...';
const titleSlot = <div className={`fa fa-bus ${sandboxStyles.titleIcon}`} />;

render(
  <Tipako
    {...{
      closeOnSelect,
      data,
      keyField,
      loading,
      onClearAll,
      // onSearch,
      onSelect,
      onSelectAll,
      renderEmpty,
      renderGroup,
      renderItem,
      searchable,
      stylesheets,
      titlePlaceholder,
      titleSlot,
      titleValue,
      valueField
    }}
  />,
  window.document.getElementById('root')
);
