import React, { PropTypes } from 'react';
import RipangaCaret from './RipangaCaret';
import RipangaHeadCell from './RipangaHeadCell';

const RipangaHeadRow = ({
  allChecked,
  allCollapsed,
  columnDefinitions,
  onCheckAll,
  onCollapseAll,
  onSort,
  showCheckboxes,
  showGroups,
  styles
}) => {
  const cells = columnDefinitions.reduce((acc, def) => {
    if (def.hidden !== true) {
      acc.push(RipangaHeadCell({ def, onSort, styles }));
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
      <div key='head-controls' className={styles.controlCell}>
        {caret}
        {checkbox}
      </div>
    );
  }

  return <div className={styles.headRow}>{cells}</div>;
};

/* eslint react/require-default-props: 0 */
RipangaHeadRow.propTypes = {
  allChecked: PropTypes.bool.isRequired,
  allCollapsed: PropTypes.bool.isRequired,
  columnDefinitions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCheckAll: PropTypes.func.isRequired,
  onCollapseAll: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  showCheckboxes: PropTypes.bool.isRequired,
  showGroups: PropTypes.bool.isRequired,
  styles: PropTypes.shape().isRequired
};

export default RipangaHeadRow;
