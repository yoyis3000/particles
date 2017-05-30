import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { LocationPicker } from './LocationPicker';
import { LocationCreator } from '../../LocationCreator';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';
import { locationPickerWithCreatorSelector } from 'redux/selectors/location';
import locationMapDispatch from 'redux/dispatch/location';

@autobind
export class LocationPickerWithCreator extends React.Component {
  static propTypes = {
    sessionId: PropTypes.string,
    onChange: PropTypes.func,
    setInitValue: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.object,
      ImmutablePropTypes.map,
    ]),
  };

  componentDidMount() {
    this.props.setInitValue();
  }

  render() {
    const { props: { sessionId, changeValue } } = this;
    return (
      <div>
        <LocationCreator {...this.props} />
        <LocationPicker
          {...this.props}
          onChange={changeValue}
        />
      </div>
    );
  }
}

export default connect(
  locationPickerWithCreatorSelector,
  locationMapDispatch,
)(LocationPickerWithCreator);
