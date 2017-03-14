import React from 'react';
import { render } from 'react-dom';
import sandboxStyles from './sandbox.scss';

import BulkEditor, { DatePicker, Input, Picker } from '../src';

const data = [
  { text: 'Animals',
    id: 100,
    disabled: true,
    children: [
      { text: 'Dolphin', id: 2 },
      { text: 'Albatross', id: 3 },
      { text: 'German Shepherd', id: 4 },
      { text: 'Mole', id: 5 },
      { text: 'Lesser Southern Floridian Muskrat', id: 6 }
    ]
  },

  { text: 'Woodworking',
    id: 7,
    children: [
      { text: 'Lutherie', id: 8 },
      { text: 'Carpentry', id: 9 },
      { text: 'Parquetry', id: 10 },
      { text: 'Joinery', id: 11 },
      { text: 'Cabinetry', id: 12 }
    ]
  },

  { text: 'Saturnian Moons Found Around Saturn',
    id: 13,
    children: [
      { text: 'Tethys', id: 14 },
      { text: 'Calypso', id: 15 },
      { text: 'Enceladus', id: 16 },
      { text: 'Rhea', id: 17 },
      { text: 'Iapetus', id: 18 }
    ]
  },

  { text: 'An empty group appears!', id: 19, children: [] },

  { text: 'Magnetic', id: 20 },
  { text: 'Guacamole', id: 21 },
  { text: 'Crankshaft', id: 22 },
  { text: 'Demographic', id: 23 },
  { text: 'Almond', id: 24 }
];

const items = ['1: Item to Edit', '2: Item to Edit as well', '3: Another Item to Edit'];
const stylesheets = [sandboxStyles];

render(
  <div style={{ margin: '10px' }}>
    <BulkEditor {...{ items, stylesheets }}>
      <Picker label='First' inputName='picker1' data={data} />
      <Input label='Second' inputName='input1' />
      <Input label='Third' inputName='input2' type='number' placeholder='In Days' />
      <DatePicker label='Fourth' inputName='DatePicker1' placeholder='mm/dd/yy' />
    </BulkEditor>
  </div>,
  window.document.getElementById('root')
);
