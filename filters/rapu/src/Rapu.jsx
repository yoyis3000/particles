import React, { PropTypes } from 'react';
import cx from 'classnames';
import qs from 'qs';
import styles from './Rapu.scss';

const i18n = {
  SEARCH_PLACEHOLDER: 'Search'
};

export default class Rapu extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  static defaultProps = {
    onSubmit: () => {}
  };

  constructor(props) {
    super(props);

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

  _handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  _handleClear = () => {
    const value = '';
    this.setState({ value });
    this._updateUrl(value);

    this.props.onSubmit(value);
  }

  _handleSubmit = () => {
    const value = this.state.value;
    this._updateUrl(value);

    this.props.onSubmit(value);
  }

  _handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      this._handleSubmit();
    }
  }

  _updateUrl = (value) => {
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
          placeholder={i18n.SEARCH_PLACEHOLDER}
          onSubmit={this._onSubmit}
          onChange={this._handleChange}
          onKeyUp={this._handleKeyUp}
        />

        <div
          className={cx(styles['btn-submit'], 'fa', 'fa-search')}
          onClick={this._handleSubmit}
        />

        <div
          className={cx(styles['btn-clear'], 'fa', 'fa-times',
            { hidden: this.state.value.length === 0 })}
          onClick={this._handleClear}
        />
      </div>
    );
  }
}
