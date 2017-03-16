import React, { PropTypes } from 'react';
import Uta from 'uta';
import baseStyles from './ListPartial.scss';
import defaultStyles from './ListPartialDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

const ListPartial = ({
  exportComponent,
  filterComponent,
  headerComponent,
  isLoading,
  notifications,
  paginationComponent,
  searchComponent,
  stylesheets,
  tableComponent
}) => {
  styles = composeStyles(baseStyles, [defaultStyles, ...stylesheets]);

  return (<div>
    <div className={styles.exportComponent}>
      { exportComponent && exportComponent }
    </div>

    <div className={styles.toolHeader}>
      {headerComponent && headerComponent}
    </div>
    <div>
      <div className={styles.toolControls}>
        <div className={styles.searchComponent}>
          { searchComponent && searchComponent }
        </div>
        <div className={styles.filterComponent}>
          { filterComponent && filterComponent }
        </div>
      </div>

      <div className={styles.notifications}>
        { notifications && notifications }
      </div>

      <Uta isLoading={isLoading}>
        { paginationComponent && paginationComponent }
        { tableComponent && tableComponent }
        { paginationComponent && paginationComponent }
      </Uta>
    </div>
  </div>);
};

ListPartial.propTypes = {
  exportComponent: PropTypes.shape(),
  filterComponent: PropTypes.shape(),
  headerComponent: PropTypes.shape(),
  isLoading: PropTypes.bool,
  notifications: PropTypes.arrayOf(PropTypes.shape()),
  paginationComponent: PropTypes.shape(),
  searchComponent: PropTypes.shape(),
  stylesheets: PropTypes.arrayOf(PropTypes.shape()),
  tableComponent: PropTypes.shape()
};

ListPartial.defaultProps = {
  exportComponent: null,
  filterComponent: null,
  headerComponent: null,
  isLoading: false,
  notifications: null,
  paginationComponent: null,
  searchComponent: null,
  stylesheets: [],
  tableComponent: null
};

export default ListPartial;
