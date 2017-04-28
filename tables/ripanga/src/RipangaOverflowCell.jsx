import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './Ripanga.scss';

function throttleAndDebounce(fn, ms) {
  let debounceTimer = null;
  let throttleExecute = true;

  return (evt) => {
    evt.persist && evt.persist();

    if (throttleExecute) {
      fn(evt);
      throttleExecute = false;
      setTimeout(() => { throttleExecute = true; }, ms);
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn.bind(null, evt), ms);
  };
}

const scrollTop = () =>
  (document.documentElement && document.documentElement.scrollTop) ||
  document.body.scrollTop;

let bounds = {};
let initialTop = 0;
let computedStyle = {
  paddingLeft: '0px',
  paddingTop: '0px',
};

export default class RipangaOverflowCell extends React.Component {
  // static propTypes = {
  //   def: PropTypes.shape().isRequired,
  //   styles: PropTypes.shape().isRequired
  // };

  constructor(props) {
    super(props);

    window.addEventListener('click', this.onBlur);

    this.state = { isFocused: false };
  }

  onFocus = (evt) => {
    evt.stopPropagation();

    computedStyle = window.getComputedStyle(this.container.parentNode);
    bounds = this.container.parentNode.getBoundingClientRect();

    const T = parseInt(computedStyle.paddingTop.slice(0, -2));
    const L = parseInt(computedStyle.paddingLeft.slice(0, -2));

    this.container.style.top = (bounds.top + T + 2) + 'px';
    this.container.style.width = (bounds.width - 2 * L) + 'px';
    this.container.style.left = (bounds.left + L) + 'px';
    // this.container.style.height = bounds.height + 'px';

    initialTop = scrollTop() +  bounds.top + T + 2;

    window.removeEventListener('scroll', this.onScroll);
    window.addEventListener('scroll', this.onScroll);

    this.setState({ isFocused: true });
  }

  onBlur = () => {
    this.container.style.top = 0;
    this.container.style.left = 0;
    window.removeEventListener('scroll', this.onScroll);
    this.setState({ isFocused: false });
  }

  onScroll = () => {
    // this.container.style.top = (scrollTop() + bounds.top + parseInt(computedStyle.paddingTop.slice(0, -2))) + 'px';
    this.container.style.top = (initialTop - scrollTop()) + 'px';
  }

  render() {
    return (<div
      onClick={this.onFocus}
      // onFocus={this.onFocus}
      // onBlur={this.onBlur}
      className={cx(styles.overflowContainer, { [styles.focused]: this.state.isFocused })}
      ref={(el) => { this.container = el; }}
      >
        {this.props.children}
      </div>);
  }
};
