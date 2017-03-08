import React, { PropTypes } from 'react';
import RipangaCaret from './RipangaCaret';
import RipangaHeadCell from './RipangaHeadCell';

const RipangaHeadRow = ({
  // allChecked,
  allCollapsed,
  columnDefinitions,
  globalKey,
  idKey,
  isGrouped,
  // onCheckAll,
  onCollapseAll,
  onSort,
  styles
}) => {
  // const indices = tableData.reduce((acc, group) => acc.concat(group.data.map(v => v[idKey])), []);
  //
  // const checkedCount = indices.reduce((acc, i) => {
  //   if (checkedIds[i] === true) {
  //     return acc + 1;
  //   }
  //
  //   return acc;
  // }, 0);

  // const onChange = (evt) => {
    // evt.target.checked
    //   ? actions.setChecked({ ids: indices, globalKey, onCheck })
    //   : actions.setUnchecked({ ids: indices, globalKey, onCheck });
  // };

  const cells = columnDefinitions.reduce((acc, def) => {
    if (def.hidden !== true) {
      acc.push(RipangaHeadCell({ def, globalKey, idKey, onSort }));
    }

    return acc;
  }, []);

  // const checkbox = (showCheckboxes
  //   ? <input
  //     type="checkbox"
  //     checked={indices.length === checkedCount}
  //     onChange={onChange}
  //   />
  //   : null);
  const checkbox = null;

  const caret = (isGrouped ? RipangaCaret({ closed: allCollapsed, onClick: onCollapseAll }) : null);

  if (checkbox || caret) {
    cells.unshift(
      <th key={'head-controls'} className={styles.headControls}>
        {caret}
        {checkbox}
      </th>
    );
  }

  return (
    <thead>
      <tr>
        {cells}
      </tr>
    </thead>
  );
};

/* eslint-disable react/require-default-props */
RipangaHeadRow.propTypes = {
  // allChecked: PropTypes.bool.isRequired,
  allCollapsed: PropTypes.bool.isRequired,
  columnDefinitions: PropTypes.arrayOf(PropTypes.object).isRequired,
  globalKey: PropTypes.string.isRequired,
  idKey: PropTypes.string.isRequired,
  // onCheckAll: PropTypes.func.isRequired,
  onCollapseAll: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  styles: PropTypes.shape().isRequired
};

export default RipangaHeadRow;
