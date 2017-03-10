import React, { Component, PropTypes } from 'react';
import { TipakoSingle as SelectComponent } from 'tipako';
import defaultStyles from './Select.scss';

import composeStyles from '../../../../shared/stylesheetComposer';

let styles = {};

class Select extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    emptyMsg: PropTypes.string,
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    stylesheets: PropTypes.arrayOf(PropTypes.shape),
    valueField: PropTypes.string
  }

  static defaultProps = {
    data: [],
    emptyMsg: 'Select or Search...',
    onChange: () => {},
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
      emptyMsg,
      inputName,
      label,
      valueField
    } = this.props;

    return (
      <div>
        <label>{label}</label>
        <SelectComponent data={data} placeholder={emptyMsg} stylesheets={[styles]} />
        <input type='hidden' value={this.state.value[valueField]} name={inputName} />
      </div>
    );
  }
}

export default Select;
