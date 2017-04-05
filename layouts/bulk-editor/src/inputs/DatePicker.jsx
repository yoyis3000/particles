import React, { Component, PropTypes } from 'react';
import DateSelect from './DateSelect';

export default class DatePicker extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    stylesheets: PropTypes.shape(),
    valueField: PropTypes.string
  }

  static defaultProps = {
    data: [],
    onChange: () => {},
    placeholder: 'mm/dd/yy',
    stylesheets: [],
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
      stylesheets,
      valueField
    } = this.props;

    return (
      <div>
        <label>{label}</label>
        <DateSelect data={data} placeholder={placeholder} stylesheets={stylesheets} />
        <input type='hidden' value={this.state.value[valueField]} name={inputName} />
      </div>
    );
  }
}
