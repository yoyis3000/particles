import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';
import { compose } from 'ramda';
import { onlyUpdateForKeys } from 'recompose';
import windowResize from './decorator.jsx';
import { throttle } from 'lodash';

const _getHeightFromRef = (ref, defaultValue = 0) =>
  ref ? findDOMNode(ref).offsetHeight : defaultValue;

const _getHeightWithoutBorderFromRef = (ref, defaultValue = 0) => {
  if (!ref) {
    return defaultValue;
  }

  const refNode = findDOMNode(ref);
  const borderTopSize = window
    .getComputedStyle(refNode, null)
    .getPropertyValue('border-top-width');
  const borderBottomSize = window
    .getComputedStyle(refNode, null)
    .getPropertyValue('border-bottom-width');
  const totalBorderSize = (
    parseInt(borderBottomSize, 10) + parseInt(borderTopSize, 10)
  );

  return refNode.offsetHeight - totalBorderSize;
};

class Modal extends React.Component {
  constructor({ resizeModal }) {
    super();
    this.state = { headerHover: false };
    this._throttledResize = throttle(resizeModal, 500, { trailing: true });
  }

  getChildContext() {
    const content = this.refs.content;
    return {
      modal: {
        getHeight: () => {
          return _getHeightWithoutBorderFromRef(content);
        },
      },
    };
  }

  onResize() {
    const { footer, header, content, position } = this.refs;
    const { bodyHeight, gutter, show } = this.props;
    const windowHeight = window.innerHeight;

    if (!show) return;

    const headerHeight = _getHeightFromRef(header);
    const contentHeight = _getHeightFromRef(content);
    const footerHeight = _getHeightFromRef(footer);

    const positionEl = findDOMNode(position);
    const positionWidth = positionEl.offsetWidth;

    this._throttledResize({
      bodyHeight,
      contentHeight,
      footerHeight,
      gutter,
      headerHeight,
      positionWidth,
      windowHeight,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.show === true && prevProps.show === false) {
      this._onShow();
    }
  }

  _onHide() {
    const { onHide } = this.props;
    onHide && onHide();
  }

  _onShow() {
    this.onResize();
  }

  _toggleHover() {
    this.setState({ headerHover: !this.state.headerHover });
  }

  render() {
    const {
      bodyHeight,
      children,
      className: propClassName,
      custom,
      customWidth,
      footer,
      header,
      headerLink,
      height,
      innerHeight,
      innerOverflow,
      label,
      large,
      marginLeft,
      marginTop,
      medium,
      scope,
      scrollBody,
      show,
      small,
    } = this.props;
    const className = cx(
      'modal-window', propClassName, {
        'modal-show': show,
        'modal-small': small,
        'medium': medium,
        'modal-large': large,
      }
    );
    const linkStyle = (this.state.headerHover) ?
      { color: '#5E92CD' } : { textDecoration: 'underline', color: 'inherit' };
    const modalLabel = label && ((headerLink && label !== 'Loading...') ?
      <h1>
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          href={headerLink || '#'}
          onMouseEnter={this._toggleHover}
          onMouseLeave={this._toggleHover}
        >
          {label}
        </a>
      </h1>
      :
      <h1>{label}</h1>);
    return (
      <span className={className} data-modal-scope={scope}>
        <div className="fixed fill-container">
          <div onClick={this._onHide} className="scrim fill-container" />
          <div
            ref="position"
            className="position"
            style={{ marginTop, marginLeft, height, width: customWidth }}
          >
            {custom ? children : (
              <div className="modal-entity">
                {(header || modalLabel) && (
                  <header ref="header" className="modal-header">
                    {header ? header : modalLabel}
                    <i
                      className="modal-close fa fa-close"
                      onClick={this._onHide}
                    />
                  </header>
                )}
                <div
                  className={cx('modal-main', { 'scroll-y': scrollBody })}
                  style={{ height: innerHeight }}
                >
                  <div
                    ref="content"
                    className={cx('modal-content', { 'fill-height': bodyHeight })}
                    style={{ overflowY: innerOverflow }}
                  >
                    {this.props.children}
                  </div>
                </div>
                {footer && (
                  <footer ref="footer" className="modal-footer">
                    {footer}
                  </footer>
                )}
              </div>
            )}
          </div>
        </div>
      </span>
    );
  }
}

Modal.childContextTypes = {
  modal: PropTypes.shape({
    getHeight: PropTypes.func,
  }),
};

Modal.propTypes = {
  bodyHeight: PropTypes.number,
  borderOffset: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
  custom: PropTypes.bool,
  footer: PropTypes.node,
  gutter: PropTypes.number,
  header: PropTypes.node,
  headerLink: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  innerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  innerOverflow: PropTypes.oneOf(['visible', 'hidden', 'scroll']),
  label: PropTypes.string,
  marginLeft: PropTypes.number,
  marginTop: PropTypes.number,
  onHide: PropTypes.func,
  onShow: PropTypes.func,
  resizeModal: PropTypes.func,
  scrollBody: PropTypes.bool,
  setSession: PropTypes.string,
  scope: PropTypes.string,
  show: PropTypes.bool,
  // sizes
  small: PropTypes.bool,
  medium: PropTypes.bool,
  large: PropTypes.bool,
  customWidth: PropTypes.number,
};

Modal.defaultProps = {
  borderOffset: 4,
  className: '',
  custom: false,
  gutter: 75,
  height: 'auto',
  label: '',
  large: false,
  marginTop: 0,
  medium: false,
  scope: 'modal-scope',
  scrollBody: false,
  show: false,
  small: false,
  innerOverflow: 'visible',
};

export default compose(
  onlyUpdateForKeys([
    'bodyHeight',
    'children',
    'footer',
    'header',
    'height',
    'innerHeight',
    'label',
    'marginLeft',
    'marginTop',
    'show',
  ]),
  windowResize,
)(Modal);
