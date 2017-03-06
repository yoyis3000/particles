import React, { PropTypes } from 'react';
import styles from './Ripanga.scss';

const RipangaStickyCells = ({
  collapsedGroups = [],  // TODO REQUIRED and proptypes?
  idKey,
  renderBodyStickyCell,
  renderGroupStickyCell,
  tableData,
  toggledGroups
}) => {
  const renderBodyStickyCells = (data, groupIndex = 0) => {
    if (collapsedGroups[groupIndex] === true ||
      toggledGroups[groupIndex] === true) {
      return [];
    }

    if (data[0][idKey] === undefined) {
      console.error(`Sticky cell renderer aborted: missing ID key '${idKey}'`); // eslint-disable-line
      return [];
    }

    return data.map(obj => (<div
      className={styles.stickyCell}
      key={`sticky-cell-${obj[idKey]}`}
    >
      {renderBodyStickyCell(obj)}
    </div>)
    );
  };

  const renderGroupStickyCells = () => {
    const cells = [];

    tableData.forEach((group, index) => {
      cells.push(renderGroupStickyCell(group.data, index));
      cells.push(renderBodyStickyCells(group.data, index));
    });

    return cells;
  };

  const isNotGrouped = (tableData.length === 1 && tableData[0].key === undefined);

  return (isNotGrouped
    ? renderBodyStickyCells(tableData[0].data)
    : renderGroupStickyCells());
};

RipangaStickyCells.propTypes = {
  collapsedGroups: PropTypes.arrayOf(PropTypes.any).isRequired,
  idKey: PropTypes.string,
  renderBodyStickyCell: PropTypes.func.isRequired,
  renderGroupStickyCell: null,
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggledGroups: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

RipangaStickyCells.defaultProps = {
  idKey: 'id',
  renderBodyStickyCell: null,
  renderGroupStickyCell: null
};

export default RipangaStickyCells;
