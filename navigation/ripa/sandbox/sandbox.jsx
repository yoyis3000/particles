import { render } from 'react-dom';
import React from 'react';

import Ripa, { RipaControlled } from '../src';

const onChange = () => {
  console.warn('Tab changed; external callback triggered.');
};

const labels = [
  { k: 'foo', v: 'The Foo' },
  { k: 'bar', v: 'A Bar' },
  { k: 'baz', v: 'Some Baz' }
];

const slot = <div>Right side slot</div>;

const titleA = 'Vanilla Ripa';
const titleB = 'Ripa Controlled';

const selectedKey = labels[0].k;

render(
  <div>
    <Ripa
      {...{ onChange, labels, slot, selectedKey }}
      title={titleA}
    />
    <RipaControlled
      {...{ onChange, labels, slot, selectedKey }}
      title={titleB}
    />
  </div>,
  window.document.getElementById('root')
);
