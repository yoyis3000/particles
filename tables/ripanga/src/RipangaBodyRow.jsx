import React, { PropTypes } from 'react';

const RipangaBodyRow = ({
  columnDefinitions,
  idKey,
  isChecked,
  onCheck,
  renderBodyRow,
  renderBodyStickyCell,
  rowData,
  showCheckboxes,
  styles
}) => {
  const cells = columnDefinitions.map((def, i) => {
    if (def.hidden === true) {
      return null;
    }

    return def.renderer(rowData, i);
  });

  renderBodyStickyCell
    ? cells.push(<td key={`${rowData[idKey]}-sticky`} className={styles.stickyCell}>{renderBodyStickyCell(rowData)}</td>)
    : cells.push(<td className={styles.stickyCell} />);

  const onChange = () => {
    onCheck(rowData[idKey]);
  };

  if (showCheckboxes) {
    cells.unshift(<td key={`${rowData[idKey]}-checkboxes`} className={styles.controlCell}>
      <div className={styles.controlPlaceholder} />
      <label className={styles.controlCheckbox}>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={onChange}
        />
      </label>
    </td>);
  }

  return <tr key={`row-${rowData.key}`} className={styles.bodyRow}>{cells}</tr>;
};

RipangaBodyRow.propTypes = {
  actions: PropTypes.shape(),
  checkedIds: PropTypes.shape(),
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  globalKey: PropTypes.string.isRequired,
  idKey: PropTypes.string,
  onCheck: PropTypes.func,
  renderBodyStickyCell: PropTypes.func,
  rowData: PropTypes.shape().isRequired,
  showCheckboxes: PropTypes.bool,
  styles: PropTypes.shape().isRequired
};

RipangaBodyRow.defaultProps = {
  actions: PropTypes.shape(),
  checkedIds: PropTypes.shape(),
  idKey: PropTypes.string,
  onCheck: PropTypes.func,
  showCheckboxes: PropTypes.bool,
  styles: PropTypes.shape().isRequired
};

export default RipangaBodyRow;
