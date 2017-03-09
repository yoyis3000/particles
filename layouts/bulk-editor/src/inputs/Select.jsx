import React, { Component, PropTypes } from 'react';
import { TipakoSingle as Tipako } from 'tipako';

class Select extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    emptyMsg: PropTypes.string,
    onChange: PropTypes.func,
    valueField: PropTypes.string
  }

  static defaultProps = {
    data: [],
    emptyMsg: 'Select or Search...',
    onChange: () => {},
    valueField: 'value'
  }

  onChange(value) {
    this.props.onChange(value);
    this.setState({ value });
  }

  render() {
    return (
      <div>
        <Tipako data={this.props.data} msgEmpty={this.props.emptyMsg} />
        <select type='hidden' value={this.state.value[this.props.valueField]} />
      </div>
    );
  }
}

export default Select;
