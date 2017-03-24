import React, { PropTypes } from 'react';
import RipangaCaret from './RipangaCaret';
import RipangaHeadCell from './RipangaHeadCell';
import cx from 'classnames';

const RipangaHeadRow = ({
  allChecked,
  allCollapsed,
  columnDefinitions,
  idKey,
  onCheckAll,
  onCollapseAll,
  onSort,
  renderHeadStickyCell,
  showCheckboxes,
  showGroups,
  showSticky,
  styles
}) => {
  const cells = columnDefinitions.reduce((acc, def) => {
    if (def.hidden !== true) {
      acc.push(RipangaHeadCell({ def, idKey, onSort }));
    }

    return acc;
  }, []);

  if (showCheckboxes || showGroups) {
    const checkbox = (showCheckboxes
      ? (<label className={styles.controlCheckbox}>
        <input type='checkbox' checked={allChecked} onChange={onCheckAll} />
      </label>)
      : null);

    const caret = (showGroups
      ? RipangaCaret({ closed: allCollapsed, onClick: onCollapseAll })
      : null);

    cells.unshift(
      <th key={'head-controls'} className={styles.controlCell}>
        {caret}
        {checkbox}
      </th>
    );
  }

  if (showSticky) {
    const sticky = (renderHeadStickyCell ? renderHeadStickyCell() : null);
    cells.push(<th key='sticky-head' className={cx(styles.stickyCell, styles.stickyCellHead)}>{sticky}</th>);
  }

  return (
    <thead className={styles.tableHead}>
      <tr>
        {cells}
      </tr>
    </thead>
  );
};

/* eslint react/require-default-props: 0 */
RipangaHeadRow.propTypes = {
  allChecked: PropTypes.bool.isRequired,
  allCollapsed: PropTypes.bool.isRequired,
  columnDefinitions: PropTypes.arrayOf(PropTypes.object).isRequired,
  idKey: PropTypes.string.isRequired,
  onCheckAll: PropTypes.func.isRequired,
  onCollapseAll: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  renderHeadStickyCell: PropTypes.func,
  showCheckboxes: PropTypes.bool.isRequired,
  showGroups: PropTypes.bool.isRequired,
  showSticky: PropTypes.bool.isRequired,
  styles: PropTypes.shape().isRequired
};

export default RipangaHeadRow;
