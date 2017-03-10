import React, { Component, PropTypes } from 'react';
import defaultStyles from './Input.scss';

import composeStyles from '../../../../shared/stylesheetComposer';

let styles = {};

export default class Input extends Component {
  static propTypes = {
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    stylesheets: PropTypes.arrayOf(PropTypes.shape),
    type: PropTypes.string
  }

  static defaultProps = {
    onChange: () => {},
    placeholder: '',
    stylesheets: [],
    type: 'text'
  }

  constructor(props) {
    super(props);

    styles = composeStyles(defaultStyles, [...props.stylesheets]);
    this.state = {
      value: ''
    };
  }

  onChange(value) {
    this.props.onChange(value);
    this.setState({ value });
  }

  render() {
    const {
      type,
      placeholder,
      label,
      inputName
    } = this.props;

    return (
      <div className={styles.colFlex}>
        <label>{label}</label>
        <input
          {...this.props}
          className={styles.input}
          onChange={this.onChange}
          placeholder={placeholder}
          type={type}
        />
        <input name={inputName} type='hidden' value={this.state.value} />
      </div>
    );
  }
}
