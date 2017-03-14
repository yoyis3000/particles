import React, { Component, PropTypes } from 'react';
import Select from './Select';
import defaultStyles from './Picker.scss';

import composeStyles from '../../../../shared/stylesheetComposer';

let styles = {};

export default class Picker extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    stylesheets: PropTypes.arrayOf(PropTypes.shape),
    valueField: PropTypes.string
  }

  static defaultProps = {
    data: [],
    onChange: () => {},
    placeholder: 'Pick or Search...',
    stylesheets: [],
    valueField: 'value'
  }

  constructor(props) {
    super(props);

    styles = composeStyles(defaultStyles, props.stylesheets);
    this.state = { value: {} };
  }

  onChange(value) {
    this.props.onChange(value);
    this.setState({ value });
  }

  render() {
    const {
      data,
      inputName,
      label,
      placeholder,
      valueField
    } = this.props;

    return (
      <div>
        <label>{label}</label>
        <Select data={data} placeholder={placeholder} stylesheets={[styles]} />
        <input type='hidden' value={this.state.value[valueField]} name={inputName} />
      </div>
    );
  }
}
