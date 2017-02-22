import { render } from 'react-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import Tatari from '../src';

const mockApi = new MockAdapter(axios);

mockApi
.onGet('/saved_filters')
.reply(200, {})
.onGet('/initial_filter_options')
.reply(200, {
  status: '/filterA',
  location_id: '/filterB',
})
.onGet('/filterA')
.reply(200, [
    {key: 1309646, value: 'Test A'},
    {key: 1228193, value: "Test A'postrophe"},
    {key: 1188710, value: 'Test Add'},
    {key: 1273550, value: 'Full Admin'},
    {key: 1390306, value: 'Blah Blah'},
    {key: 1119508, value: 'Elizabeth Cannon'},
])
.onGet('/filterB')
.reply(200, [
    {key: 649574, value: 'Litmus Litmus'},
    {key: 1202971, value: 'Test McTest'},
    {key: 1133792, value: 'Northern Mockingbird'},
    {key: 582118, value: 'Nautica Sales'},
    {key: 1133787, value: 'Western Scrubjay'},
    {key: 1202938, value: 'Ultimate Test'},
    {key: 1133776, value: 'California Towhee'},
]);

const urls = {
  api: {
    filters: '/saved_filters',
    filtersGet: '/initial_filter_options',
  },
  view: {
    rfi: '',
  },
};

render(
  <Tatari urls={urls} />,
  document.getElementById('root'),
);
