import React from 'react';
import { connect } from 'react-redux';
import dispatch from './TatariDispatch';
import selector from './TatariSelector';

const TatariInterface = (Component) => {
  const TatariComponent = props => <Component{...props} />;

  return connect(
    selector,
    dispatch,
  )(TatariComponent);
};

export default TatariInterface;
