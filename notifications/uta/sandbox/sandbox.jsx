import { render } from 'react-dom';
import React from 'react';

import Uta from '../src';

const isLoading = true;

render(
  <Uta isLoading={isLoading}>
    <div style={{ height: '300px', background: 'bisque' }}>
      I am content that is still loading.
    </div>
  </Uta>,
  window.document.getElementById('root')
);
