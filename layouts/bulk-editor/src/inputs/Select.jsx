import React, { Component, PropTypes } from 'react';
import { TipakoSingle as Tipako } from 'tipako';

class Select extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    onChange: PropTypes.func
  }

  static defaultProps = {
    data: [],
    onChange: () => {}
  }

  onChange(value) {
    this.props.onChange(value);
    this.setState({ value });
  }

  render() {
    return (
      <div>
        <Tipako data={this.props.data} />
        <select type='hidden' value={this.state.value} />
      </div>
    );
  }
}

export default Select;
