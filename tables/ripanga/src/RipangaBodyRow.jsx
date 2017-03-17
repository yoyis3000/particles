import React, { PropTypes } from 'react';

const RipangaBodyRow = ({
  columnDefinitions,
  idKey,
  isChecked,
  onCheck,
  renderBodyStickyCell,
  rowData,
  showCheckboxes,
  showGroups,
  showSticky,
  styles
}) => {
  const cells = columnDefinitions.map((def, i) => {
    if (def.hidden === true) {
      return null;
    }

    return def.renderer(rowData, i);
  });

  if (showSticky) {
    const sticky = (renderBodyStickyCell
      ? renderBodyStickyCell(rowData)
      : null);

    cells.push(<td key={`${rowData[idKey]}-sticky`} className={styles.stickyCell}>{sticky}</td>);
  }

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

  return (<tr key={`row-${rowData.key}`} className={styles.bodyRow}>
    {cells}
  </tr>);
};

/* eslint react/require-default-props: 0 */
RipangaBodyRow.propTypes = {
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  idKey: PropTypes.string,
  isChecked: PropTypes.bool,
  onCheck: PropTypes.func,
  renderBodyStickyCell: PropTypes.func,
  rowData: PropTypes.shape().isRequired,
  showCheckboxes: PropTypes.bool,
  showSticky: PropTypes.bool.isRequired,
  styles: PropTypes.shape().isRequired
};

export default RipangaBodyRow;
