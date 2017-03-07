import React, { PropTypes } from 'react';
import RipangaHeadCell from './RipangaHeadCell';

const RipangaHeadRow = ({
  actions,
  checkedIds,
  columnDefinitions,
  globalKey,
  idKey,
  onCheck,
  onSort,
  showCheckboxes,
  tableData
}) => {
  const indices = tableData.reduce((acc, group) => acc.concat(group.data.map(v => v[idKey])), []);

  const checkedCount = indices.reduce((acc, i) => {
    if (checkedIds[i] === true) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const onChange = (evt) => {
    evt.target.checked
      ? actions.setChecked({ ids: indices, globalKey, onCheck })
      : actions.setUnchecked({ ids: indices, globalKey, onCheck });
  };

  const renderCell = (def) => {
    if (def.hidden === true) {
      return null;
    }

    return RipangaHeadCell({ def, globalKey, idKey, onSort });
  };

  const cells = columnDefinitions.map(renderCell);

  if (showCheckboxes) {
    cells.unshift(<th className='headControls' key='headControls'>
      <input
        type='checkbox'
        checked={indices.length === checkedCount}
        onChange={onChange}
      />
    </th>);
  }

  return (
    <thead>
      <tr>
        {cells}
      </tr>
    </thead>
  );
};

RipangaHeadRow.propTypes = {
  actions: PropTypes.shape(),
  checkedIds: PropTypes.shape(),
  columnDefinitions: PropTypes.arrayOf(PropTypes.object).isRequired,
  globalKey: PropTypes.string.isRequired,
  idKey: PropTypes.string,
  onCheck: PropTypes.func,
  onSort: PropTypes.func,
  showCheckboxes: PropTypes.bool.isRequired,
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired
};

RipangaHeadRow.defaultProps = {
  actions: {},
  checkedIds: PropTypes.shape(),
  idKey: 'id',
  onCheck: null,
  onSort: null
};

export default RipangaHeadRow;
