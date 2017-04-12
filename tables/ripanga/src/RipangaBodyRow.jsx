import React, { PropTypes } from 'react';
import cx from 'classnames';

const RipangaBodyRow = ({
  columnDefinitions,
  idKey,
  isChecked,
  onCheck,
  renderCell,
  rowData,
  showCheckboxes,
  styles
}) => {
  const cells = columnDefinitions.map((def) => {
    if (def.hidden === true) {
      return null;
    }

    return (<div
      key={`cell-${rowData[idKey]}-${def.key}`}
      className={cx(styles.tableCell, styles[`w${def.width}px`])}
    >
      {renderCell(rowData, def)}
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
  renderCell: PropTypes.func,
  rowData: PropTypes.shape().isRequired,
  showCheckboxes: PropTypes.bool,
  styles: PropTypes.shape().isRequired
};

export default RipangaBodyRow;
