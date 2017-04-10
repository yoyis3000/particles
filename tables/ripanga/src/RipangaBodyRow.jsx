import React, { PropTypes } from 'react';
import cx from 'classnames';

const RipangaBodyRow = ({
  columnDefinitions,
  idKey,
  isChecked,
  onCheck,
  renderBodyCell,
  renderBodyRow,
  renderBodyStickyCell,
  rowData,
  showCheckboxes,
  showSticky,
  styles
}) => {
  const cells = columnDefinitions.map((def, i) => {
    if (def.hidden === true) {
      return null;
    }

    return (<div
      key={`cell-${rowData[idKey]}-${i}`}
      className={cx(styles.tableCell, styles[`w${def.width}px`])}
    >
      {renderBodyCell(rowData, i)}
    </div>);
  });

  const onChange = () => {
    onCheck(rowData[idKey]);
  };

  if (showCheckboxes) {
    cells.unshift(<div key={`${rowData[idKey]}-checkboxes`} className={styles.controlCell}>
      <div className={styles.controlPlaceholder} />
      <label className={styles.controlCheckbox}>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={onChange}
        />
      </label>
    </div>);
  }

  if (showSticky) {
    const sticky = (renderBodyStickyCell
      ? renderBodyStickyCell(rowData)
      : null);

    cells.push(<div key={`${rowData[idKey]}-sticky`} className={styles.stickyCell}>{sticky}</div>);
  }

  return (<div key={`row-${rowData[idKey]}`} className={styles.tableRow}>
    {cells}
  </div>);
};

/* eslint react/require-default-props: 0 */
RipangaBodyRow.propTypes = {
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  idKey: PropTypes.string,
  isChecked: PropTypes.bool,
  onCheck: PropTypes.func,
  renderBodyCell: PropTypes.func,
  renderBodyRow: PropTypes.func,
  renderBodyStickyCell: PropTypes.func,
  rowData: PropTypes.shape().isRequired,
  showCheckboxes: PropTypes.bool,
  showSticky: PropTypes.bool,
  styles: PropTypes.shape().isRequired
};

export default RipangaBodyRow;
