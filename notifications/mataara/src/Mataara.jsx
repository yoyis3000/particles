import React, { PropTypes } from 'react';
import cx from 'classnames';

import baseStyles from './Mataara.scss';
import defaultStyles from './MataaraDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

const TYPES = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success'
};

const Mataara = ({ title, body, type, onCancel, noDismiss, stylesheets }) => {
  styles = composeStyles(baseStyles, [defaultStyles, ...stylesheets]);

  return (
    <div
      className={cx(
        styles.notification,
        {
          [styles.alertError]: type === TYPES.ERROR,
          [styles.alertInfo]: type === TYPES.INFO,
          [styles.alertSuccess]: type === TYPES.SUCCESS
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
  body: React.PropTypes.oneOf(PropTypes.string, PropTypes.object).isRequired,
  noDismiss: React.PropTypes.bool,
  onCancel: React.PropTypes.func,
  stylesheets: PropTypes.arrayOf(PropTypes.shape()),
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string
};

Mataara.defaultProps = {
  noDismiss: false,
  onCancel: null,
  stylesheets: [],
  type: TYPES.INFO
};

export { TYPES };
export default Mataara;
