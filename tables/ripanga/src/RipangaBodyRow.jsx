import React, { PropTypes } from 'react';

const RipangaBodyRow = ({
  actions,
  checkedIds,
  columnDefinitions,
  globalKey,
  idKey,
  onCheck,
  renderBodyRow,  // TODO REQUIRED
  rowData,
  showCheckboxes
}) => {
  const onChange = (evt) => {
    evt.target.checked
      ? actions.setChecked({ ids: [rowData[idKey]], globalKey, onCheck })
      : actions.setUnchecked({ ids: [rowData[idKey]], globalKey, onCheck });
  };

  const cells = columnDefinitions.map((def) => {
    if (def.hidden === true) {
      return null;
    }

    return def.renderer(rowData);
  });

  if (showCheckboxes) {
    cells.unshift(<td key={`${idKey}-checkboxes`}>
      <input
        type='checkbox'
        checked={checkedIds.get(rowData[idKey])}
        onChange={onChange}
      />
    </td>);
  }


  return renderBodyRow(rowData, cells);
};

export default RipangaBodyRow;

// static propTypes = {
//   checkedIds: React.PropTypes.shape(),
//   columnDefinitions: React.PropTypes.arrayOf(React.PropTypes.shape()),
//   idKey: React.PropTypes.string,
//   renderBodyCell: React.PropTypes.func,
//   renderBodyRow: React.PropTypes.func,
//   rowData: React.PropTypes.shape(),
//   showCheckboxes: React.PropTypes.bool,
//   actions: React.PropTypes.shape(),
//   globalKey: React.PropTypes.string,
//   onCheck: React.PropTypes.func,
// };
