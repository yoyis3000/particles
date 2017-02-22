import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Map } from 'immutable';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import TatariComponent from './Tatari';
import reducer from './TatariReducer';

const { NODE_ENV } = process.env;
const emptyMiddleware = () => next => action => next(action);
let logger = emptyMiddleware;

if (NODE_ENV === 'development') {
  logger = createLogger({collapsed: true});
}

const store = createStore(
  reducer,
  Map(),
  applyMiddleware(thunk, logger),
);

const TatariProvider = (props) => {
  return (
    <Provider store={store}>
      <TatariComponent {...props} />
    </Provider>
  );
};

export default TatariProvider;
