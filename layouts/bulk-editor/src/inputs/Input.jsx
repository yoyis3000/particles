import React, { Component, PropTypes } from 'react';
import defaultStyles from './Input.scss';

import composeStyles from '../../../../shared/stylesheetComposer';

export default class Input extends Component {
  static propTypes = {
    inputName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    placeholder: PropTypes.string,
    stylesheets: PropTypes.arrayOf(PropTypes.shape),
    type: PropTypes.string
  }

  static defaultProps = {
    onChange: () => {},
    onRemove: () => {},
    placeholder: '',
    stylesheets: [],
    type: 'text'
  }

  constructor(props) {
    super(props);

    this.styles = composeStyles(defaultStyles, props.stylesheets);
    this.state = {
      value: null
    };
  }

  onChange = (event) => {
    this.props.onChange(event.target.value);
    this.setState({ value: event.target.value });
  }

  onRemove = () => {
    this.props.onRemove();
    this.setState({ value: null });
  }

  removeButton = value => (
    value
    ? <button type='button' className={`fa fa-times ${this.styles.removeButton}`} onClick={this.onRemove} />
    : null
  )

  render() {
    const {
      type,
      placeholder,
      label,
      inputName
    } = this.props;

    return (
      <div className={this.styles.colFlex}>
        <label>{label}</label>
        <div className={this.styles.inputWrapper}>
          <input
            {...this.props}
            className={this.styles.input}
            onChange={this.onChange}
            placeholder={placeholder}
            type={type}
            value={this.state.value}
          />
          {this.removeButton(this.state.value)}
        </div>
        <input name={inputName} type='hidden' value={this.state.value} />
      </div>
    );
  }
}
