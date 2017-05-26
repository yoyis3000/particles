/* global $ */
import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import axios from 'axios';
import autobind from 'autobind-decorator';
import { LocationPickerWithCreator } from './LocationPickerWithCreator';
import { locationToggleSelector } from 'redux/selectors/location';
import locationMapDispatch from 'redux/dispatch/location';

@autobind
export class LocationToggle extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    collection: ImmutablePropTypes.map,
    setSession: PropTypes.func,
    value: ImmutablePropTypes.map,
  };

  static defaultProps = {
    value: {},
  };

  constructor({value}) {
    super();
    this.state = {
      show: false,
      value,
    };
  }

  _onClickLabel() {
    this.setState({show: !this.state.show});
  }

  _onChange(value) {
    const {
      object_class,
      object_id,
      object_field = 'location_name',
    } = this.props;
    const endpoint = 'update_field_inplace';
    const object_original_value = value;
    const update_value = value.full_name || '';
    const headers = {
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        'Content-Type': 'application/json',
      },
    };

    axios.post(
      endpoint,
      {
        object_class,
        object_id,
        object_field,
        object_original_value,
        update_value,
        new_value: update_value,
      },
      headers
    )
    .then(() => this.setState({ show: false, value }))
    .catch(() => this.setState({show: false }));
  }

  render() {
    const { state: { value, show } } = this;

    if (show) {
      return (
        <LocationPickerWithCreator
          {...this.props}
          value={value}
          changeValue={this._onChange}
        />
      );
    }
    return (
      <div
        ref="placeholder"
        className="toggle clickable"
        onClick={this._onClickLabel}
        >
        {value.full_name}
      </div>
    );
  }
}

export default connect(
  locationToggleSelector,
  locationMapDispatch,
)(LocationToggle);
