import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './Ripanga.scss';

const Caret = ({
  closed,
  disabled,
  onClick
}) => (<div
  className={cx(styles['ripanga-caret'], { [styles.closed]: closed, [styles.disabled]: disabled })}
  onClick={onClick}
>
  <i className='fa fa-chevron-down' />
</div>);

Caret.propTypes = {
  closed: PropTypes.boolean,
  disabled: PropTypes.boolean,
  onClick: PropTypes.func.isRequired
};

Caret.defaultProps = {
  closed: false,
  disabled: false
};

export default Caret;
