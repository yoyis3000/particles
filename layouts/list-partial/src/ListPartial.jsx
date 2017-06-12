import React from 'react';
import PropTypes from 'prop-types';
import Uta from 'uta';
import baseStyles from './ListPartial.scss';
import defaultStyles from './ListPartialDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

const ListPartial = ({
  bulkEditorComponent,
  controlComponent,
  filterComponent,
  headerComponent,
  isLoading,
  notifications,
  paginationComponent,
  searchComponent,
  stylesheets,
  tableComponent
}) => {
  const styles = composeStyles(baseStyles, [defaultStyles, ...stylesheets]);

  return (<div className={styles.listPartialContainer}>
    <div className={styles.toolHeader}>
      {headerComponent && headerComponent}
    </div>
    <div>
      <div className={styles.toolControls}>
        <div className={styles.controlComponent}>
          { controlComponent && controlComponent }
        </div>
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

      <div className={styles.bulkEditorComponent}>
        { bulkEditorComponent && bulkEditorComponent }
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
  bulkEditorComponent: PropTypes.shape(),
  controlComponent: PropTypes.shape(),
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
  bulkEditorComponent: null,
  controlComponent: null,
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
