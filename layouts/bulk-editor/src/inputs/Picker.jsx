import React, { Component, PropTypes } from 'react';
import Select from './Select';

import defaultStyles from './Picker.scss';

import composeStyles from '../../../../shared/stylesheetComposer';

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
    this.styles = composeStyles(defaultStyles, props.stylesheets);
    this.state = { value: {} };
  }

  onChange = (value) => {
    this.props.onChange(value);
    this.setState({ value });
  }

  render() {
    const {
      data,
      inputName,
      label,
      placeholder,
      stylesheets,
      valueField
    } = this.props;

    return (
      <div>
        <label className={this.styles.label}>{label}</label>
        <Select
          data={data}
          onChange={this.onChange}
          placeholder={placeholder}
          stylesheets={stylesheets}
        />
        <input type='hidden' value={this.state.value[valueField]} name={inputName} />
      </div>
    );
  }
}
