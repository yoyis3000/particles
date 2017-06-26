import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const RipangaBodyRow = ({
  columnDefinitions,
  idKey,
  isChecked,
  isMinHeight,
  onCheck,
  renderCell,
  rowData,
  showCheckboxes,
  showGroups,
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

  const placeholder = showGroups ? <div className={styles.controlPlaceholder} /> : null;

  if (showCheckboxes) {
    cells.unshift(<div key={`${rowData[idKey]}-checkboxes`} className={styles.controlCell}>
      {placeholder}
      <label className={styles.controlCheckbox}>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={onChange}
        />
      </label>
    </div>);
  } else if (showGroups === true) {
    cells.unshift(<div key={`${rowData[idKey]}-checkboxes`} className={styles.controlCell}>
      {placeholder}
    </div>);
  }

  return (<div
    key={`row-${rowData[idKey]}`}
    className={cx(styles.tableRow, { [styles.minHeight]: isMinHeight })}
  >{cells}
  </div>);
};

/* eslint react/require-default-props: 0 */
RipangaBodyRow.propTypes = {
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  idKey: PropTypes.string,
  isChecked: PropTypes.bool,
  isMinHeight: PropTypes.bool,
  onCheck: PropTypes.func,
  renderCell: PropTypes.func,
  rowData: PropTypes.shape().isRequired,
  showCheckboxes: PropTypes.bool,
  showGroups: PropTypes.bool,
  styles: PropTypes.shape().isRequired
};

export default RipangaBodyRow;
