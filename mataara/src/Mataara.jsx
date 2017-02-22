import React from 'react';
import cx from 'classnames';

import styles from './Mataara.scss';

const TYPES = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
};

const Mataara = ({ title, body, type, onCancel, noDismiss }) => {
  return (
    <div
      className={cx(
        styles.notification,
        {
          [styles.alertError]: type === TYPES.ERROR,
          [styles.alertInfo]: type === TYPES.INFO,
          [styles.alertSuccess]: type === TYPES.SUCCESS,
        },
      )}
    >
      <span className={styles.title}>{title}</span>
      <span className={styles.body}>{body}</span>
      <div
        className={
          cx(styles.btnCancel, 'fa', 'fa-times', { [styles.hidden]: noDismiss })
        }
        onClick={onCancel}
      />
    </div>
  );
};

Mataara.propTypes = {
  body: React.PropTypes.string.isRequired,
  noDismiss: React.PropTypes.bool,
  onCancel: React.PropTypes.func,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
};

Mataara.defaultProps = {
  noDismiss: false,
  onCancel: null,
  type: TYPES.INFO,
};

export { TYPES };
export default Mataara;
