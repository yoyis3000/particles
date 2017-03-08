import React, { PropTypes } from 'react';

const RipangaBodyRow = ({
  columnDefinitions,
  idKey,
  isChecked,
  onCheck,
  renderBodyRow,
  rowData,
  showCheckboxes
}) => {
  const cells = columnDefinitions.map((def, i) => {
    if (def.hidden === true) {
      return null;
    }

    return def.renderer(rowData, i);
  });

  const onChange = () => {
    onCheck(rowData[idKey]);
  };

  if (showCheckboxes) {
    cells.unshift(<td key={`${rowData[idKey]}-checkboxes`}>
      <input
        type='checkbox'
        checked={isChecked}
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
