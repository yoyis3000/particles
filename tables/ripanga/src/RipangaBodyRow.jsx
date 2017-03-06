import React, { PropTypes } from 'react';

const RipangaBodyRow = ({
  actions,
  checkedIds,
  columnDefinitions,
  globalKey,
  idKey,
  onCheck,
  renderBodyRow,
  rowData,
  showCheckboxes
}) => {
  const onChange = (evt) => {
    evt.target.checked
      ? actions.setChecked({ ids: [rowData[idKey]], globalKey, onCheck })
      : actions.setUnchecked({ ids: [rowData[idKey]], globalKey, onCheck });
  };

  const cells = columnDefinitions.map((def, i) => {
    if (def.hidden === true) {
      return null;
    }

    return def.renderer(rowData, i);
  });

  if (showCheckboxes) {
    cells.unshift(<td key={`${rowData[idKey]}-checkboxes`}>
      <input
        type='checkbox'
        checked={checkedIds.get(rowData[idKey])}
        onChange={onChange}
      />
    </td>);
  }

  return renderBodyRow(rowData, cells);
};

RipangaBodyRow.propTypes = {
  actions: PropTypes.shape(),
  checkedIds: PropTypes.shape(),
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  globalKey: PropTypes.string.isRequired,
  idKey: PropTypes.string,
  onCheck: PropTypes.func,
  renderBodyRow: PropTypes.func.isRequired,
  rowData: PropTypes.shape().isRequired,
  showCheckboxes: PropTypes.bool
};

RipangaBodyRow.defaultProps = {
  actions: PropTypes.shape(),
  checkedIds: PropTypes.shape(),
  idKey: PropTypes.string,
  onCheck: PropTypes.func,
  showCheckboxes: PropTypes.bool
};

export default RipangaBodyRow;
