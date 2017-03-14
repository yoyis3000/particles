import React, { Component, PropTypes } from 'react';
import DateSelect from './DateSelect';

export default class DatePicker extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    styles: PropTypes.shape(),
    valueField: PropTypes.string
  }

  static defaultProps = {
    data: [],
    onChange: () => {},
    placeholder: 'mm/dd/yy',
    styles: {},
    valueField: 'value'
  }

  constructor(props) {
    super(props);
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
      styles,
      valueField
    } = this.props;

    return (
      <div>
        <label>{label}</label>
        <DateSelect data={data} placeholder={placeholder} stylesheets={[styles]} />
        <input type='hidden' value={this.state.value[valueField]} name={inputName} />
      </div>
    );
  }
}
