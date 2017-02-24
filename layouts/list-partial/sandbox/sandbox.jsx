import React from 'react';
import { render } from 'react-dom';

import ListPartial from '../src';

const headerComponent = (<div>Header Component</div>);
const filterComponent = (<div>Filter Component</div>);
const notifications = [
  <div key='1'>Notification 1</div>,
  <div key='2'>Notification 2</div>
];
const paginationComponent = (<div>Pagination Component</div>);
const searchComponent = (<div>Search Component</div>);
const tableComponent = (<div>Table Component</div>);

const isLoading = true;

render(
  <ListPartial
    {...{
      headerComponent,
      filterComponent,
      isLoading,
      notifications,
      paginationComponent,
      searchComponent,
      tableComponent
    }}
  />,
  window.document.getElementById('root'),
);
