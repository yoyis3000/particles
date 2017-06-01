import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Ripanga.scss';

const scrollTop = () =>
  (document.documentElement && document.documentElement.scrollTop) ||
  document.body.scrollTop;

let bounds = {};
let table = null;

let initialLeft = 0;
let initialTop = 0;

export default class RipangaOverflowCell extends React.Component {
  static propTypes = {
    children: PropTypes.shape().isRequired
  };

  constructor(props) {
    super(props);

    window.addEventListener('click', this.onBlur);

    this.state = { isFocused: false };
  }

  onFocus = (evt) => {
    evt.stopPropagation();

    bounds = this.container.parentNode.getBoundingClientRect();
    table = document.querySelector(`.${styles.tableContainer.split(' ').slice(0, 1)}`);

    const computedStyle = window.getComputedStyle(this.container.parentNode);
    const T = parseInt(computedStyle.paddingTop.slice(0, -2), 10);
    const L = parseInt(computedStyle.paddingLeft.slice(0, -2), 10);

    this.container.style.top = `${bounds.top + T + 2}px`;
    this.container.style.left = `${bounds.left + L}px`;
    this.container.style.width = `${bounds.width - (2 * L)}px`;

    window.removeEventListener('scroll', this.onScroll);
    window.addEventListener('scroll', this.onScroll);

    table.removeEventListener('scroll', this.onScroll);
    table.addEventListener('scroll', this.onScroll);

    initialTop = scrollTop() + bounds.top + T + 2;
    initialLeft = table.scrollLeft + bounds.left + L;

    this.setState({ isFocused: true });
  }

  onBlur = () => {
    if (table === null) {
      return;
    }

    this.container.style.top = 0;
    this.container.style.left = 0;

    table.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('scroll', this.onScroll);

    this.setState({ isFocused: false });
  }

  onScroll = () => {
    this.container.style.top = `${initialTop - scrollTop()}px`;
    this.container.style.left = `${initialLeft - table.scrollLeft}px`;
  }

  render() {
    return (<div
      onClick={this.onFocus}
      className={cx(styles.overflowContainer, { [styles.focused]: this.state.isFocused })}
      ref={(el) => { this.container = el; }}
    >
      {this.props.children}
    </div>);
  }
}
