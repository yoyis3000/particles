import React, { PropTypes } from 'react';
import RipangaCaret from './RipangaCaret';
import RipangaHeadCell from './RipangaHeadCell';

const RipangaHeadRow = ({
  allChecked,
  allCollapsed,
  columnDefinitions,
  idKey,
  onCheckAll,
  onCollapseAll,
  onSort,
  showCheckboxes,
  showGroups,
  styles
}) => {
  const cells = columnDefinitions.reduce((acc, def) => {
    if (def.hidden !== true) {
      acc.push(RipangaHeadCell({ def, idKey, onSort }));
    }

    return acc;
  }, []);

  const checkbox = (showCheckboxes
    ? (<input type='checkbox' checked={allChecked} onChange={onCheckAll} />)
    : null);

  const caret = (showGroups ? RipangaCaret({ closed: allCollapsed, onClick: onCollapseAll }) : null);

  if (checkbox || caret) {
    cells.unshift(
      <th key={'head-controls'} className={styles.tableHeadControls}>
        {caret}
        {checkbox}
      </th>
    );
  }

  return (
    <thead className={styles.tableHead}>
      <tr>
        {cells}
      </tr>
    </thead>
  );
};

RipangaHeadRow.propTypes = {
  allChecked: PropTypes.bool.isRequired,
  allCollapsed: PropTypes.bool.isRequired,
  columnDefinitions: PropTypes.arrayOf(PropTypes.object).isRequired,
  idKey: PropTypes.string.isRequired,
  onCheckAll: PropTypes.func.isRequired,
  onCollapseAll: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  showCheckboxes: PropTypes.bool.isRequired,
  showGroups: PropTypes.bool.isRequired,
  styles: PropTypes.shape().isRequired
};

export default RipangaHeadRow;
