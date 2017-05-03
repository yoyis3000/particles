import React from 'react';
import { render } from 'react-dom'; // eslint-disable-line
import axios from 'axios'; // eslint-disable-line
import MockAdapter from 'axios-mock-adapter'; // eslint-disable-line
import Tatari from '../src';
import sandboxStyles from './sandbox.scss';

const mockApi = new MockAdapter(axios);

mockApi
.onGet('/saved_filters')
  .reply(200, {})
.onGet('/available_filters')
  .reply(200, [
    {
      endpoint: '/filterA',
      key: 'ball_in_court_id',
      value: 'Ball In Court With A Very Long Name That Should Truncate'
    },
    {
      endpoint: '/filterB',
      key: 'assignee',
      value: 'Assignee'
    },
    {
      endpoint: '/filterC',
      key: 'emptyfilter',
      value: 'An Empty Filter'
    }
  ])
.onGet('/filterA')
  .reply(200, [
      { key: 1309646, value: 'Test A With Another Very Long Name That Should Wrap' },
      { key: 1228193, value: "Test A'postrophe And Oh My Gosh More Wrapping" },
      { key: 1188710, value: 'Test Add' },
      { key: 1273550, value: 'Full Admin' },
      { key: 1390306, value: 'Blah Blah' },
      { key: 1119508, value: 'Elizabeth Cannon' }
  ])
.onGet('/filterB')
  .reply(200, [
      { key: 649574, value: 'Litmus Litmus' },
      { key: 1202971, value: 'Test McTest' },
      { key: 1133792, value: 'Northern Mockingbird' },
      { key: 582118, value: 'Nautica Sales' },
      { key: 1133787, value: 'Western Scrubjay' },
      { key: 1202938, value: 'Ultimate Test' },
      { key: 1133776, value: 'California Towhee' }
  ])
.onGet('/filterC')
  .reply(200, [])
.onPatch('/patch_filters')
  .reply(200);

const urls = {
  available: '/available_filters',
  patch: '/patch_filters',
  saved: '/saved_filters'
};

const onComplete = () => {
  console.warn("Called external population function.");  // eslint-disable-line
};

const stylesheets = [sandboxStyles];

render(
  <Tatari {...{ urls, onComplete, stylesheets }} />,
  document.getElementById('root'),
);
