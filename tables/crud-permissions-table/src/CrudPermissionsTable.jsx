import React, { PropTypes } from 'react';
import cx from 'classnames';

import baseStyles from './CrudPermissionsTable.scss';
import defaultStyles from './CrudPermissionsTableDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

const CrudPermissionsTable = ({ title, body, type, onCancel, noDismiss, stylesheets }) => {
  styles = composeStyles(baseStyles, [defaultStyles, ...stylesheets]);

  return (
    <div

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

CrudPermissionsTable.propTypes = {
  body: React.PropTypes.oneOf(PropTypes.string, PropTypes.object).isRequired,
  noDismiss: React.PropTypes.bool,
  onCancel: React.PropTypes.func,
  stylesheets: PropTypes.arrayOf(PropTypes.shape()),
  title: React.PropTypes.string.isRequired
};

CrudPermissionsTable.defaultProps = {
  noDismiss: false,
  onCancel: null,
  stylesheets: []
};

export default CrudPermissionsTable;
