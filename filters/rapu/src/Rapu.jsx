import React, { PropTypes } from 'react';
import cx from 'classnames';
import qs from 'qs';
import baseStyles from './Rapu.scss';
import defaultStyles from './RapuDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

export default class Rapu extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    placeholder: PropTypes.string
  };

  static defaultProps = {
    stylesheets: [],
    placeholder: 'Search'
  };

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);

    const url = window.location.href.split('?');
    const params = qs.parse(url[1]);

    this.state = {
      value: (params.search || '')
    };
  }

  componentWillReceiveProps() {
    const url = window.location.href.split('?');
    const params = qs.parse(url[1]);

    this.setState({ value: (params.search || '') });
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  handleClear = () => {
    const value = '';
    this.setState({ value });
    this.updateUrl(value);

    this.props.onSubmit(value);
  }

  handleSubmit = () => {
    const value = this.state.value;
    this.updateUrl(value);

    this.props.onSubmit(value);
  }

  handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  updateUrl = (value) => {
    const url = window.location.href.split('?');
    const params = qs.parse(url[1]);
    params.search = value;
    params.page = 1;

    if (!value) {
      delete params.search;
    }

    history
    .pushState(
      history.state,
      '',
      `${url[0]}?${qs.stringify(params, { arrayFormat: 'brackets' })}`,
    );
  }

  render() {
    return (
      <div className={styles.search}>
        <input
          value={this.state.value}
          className={styles.input}
          type='text'
          placeholder={this.props.placeholder}
          onSubmit={this.onSubmit}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
        />

        <div
          className={cx(styles.btnSubmit, 'fa', 'fa-search')}
          onClick={this.handleSubmit}
        />

        <div
          className={cx(styles.btnClear, 'fa', 'fa-times',
            { [styles.hidden]: this.state.value.length === 0 })}
          onClick={this.handleClear}
        />
      </div>
    );
  }
}
