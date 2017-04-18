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
let container = null;

export default class RipangaOverflowCell extends React.Component {
  // static propTypes = {
  //   def: PropTypes.shape().isRequired,
  //   styles: PropTypes.shape().isRequired
  // };

  constructor(props) {
    super(props);

    window.addEventListener('scroll', this.onScroll);

    this.state = { isFocused: false };
  }

  componentDidMount() {
    container = document.querySelector(`.${styles.overflowTetherContainer}`);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onFocus = () => {
    bounds = this.overflowContainer.getBoundingClientRect();

    container.style.top = bounds.top + 'px';
    container.style.width = bounds.width + 'px';
    container.style.left = bounds.left + 'px'
    container.style.height = bounds.height + 'px';

    this.setState({ isFocused: true });
  }

  onBlur = () => {
    this.setState({ isFocused: false });
  }

  onScroll = () => {
    container.style.top = (bounds.top - scrollTop()) + 'px';
  }

  render() {
    return (<button
      onFocus={this.onFocus}
      onBlur={this.onBlur}
      className={cx(styles.overflowFocusContainer, { [styles.overflowChildFocus]: this.state.isFocused })}
      ref={(el) => { this.overflowContainer = el }}
    >
      {this.props.children}
    </button>);
  }
};
