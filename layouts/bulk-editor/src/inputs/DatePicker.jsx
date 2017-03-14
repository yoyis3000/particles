import React, { Component, PropTypes } from 'react';
import DateSelect from './DateSelect';

export default class DatePicker extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    emptyMsg: PropTypes.string,
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    styles: PropTypes.shape(),
    valueField: PropTypes.string
  }

  static defaultProps = {
    data: [],
    emptyMsg: 'Pick or Search...',
    onChange: () => {},
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
      emptyMsg,
      inputName,
      label,
      styles,
      valueField
    } = this.props;

    return (
      <div>
        <label>{label}</label>
        <DateSelect data={data} placeholder={emptyMsg} stylesheets={[styles]} />
        <input type='hidden' value={this.state.value[valueField]} name={inputName} />
      </div>
    );
  }
}
