import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Ripanga.scss';

const Caret = ({
  closed,
  disabled,
  onClick
}) => (<div
  className={cx(styles.controlCaret, { [styles.closed]: closed, [styles.disabled]: disabled })}
  onClick={onClick}
>
  <i className='fa fa-chevron-down' />
</div>);

Caret.propTypes = {
  closed: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

Caret.defaultProps = {
  closed: false,
  disabled: false
};

export default Caret;
