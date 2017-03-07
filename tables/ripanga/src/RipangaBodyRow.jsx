import React, { PropTypes } from 'react';

const RipangaBodyRow = ({
  checkedIds,
  columnDefinitions,
  globalKey,
  idKey,
  onCheck,
  renderBodyRow,
  rowData,
  setChecked,
  setUnchecked, // TODO why oncheck, setchecked, setunchecked
  showCheckboxes
}) => {
  const onChange = (evt) => {
    // evt.target.checked
    //   ? setChecked({ ids: [rowData[idKey]], globalKey, onCheck })
    //   : setUnchecked({ ids: [rowData[idKey]], globalKey, onCheck });
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
        checked={checkedIds[rowData[idKey]]}
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
  setChecked: PropTypes.func,
  setUnchecked: PropTypes.func,
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
