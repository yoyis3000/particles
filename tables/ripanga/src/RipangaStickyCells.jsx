import React, { PropTypes } from 'react';
import styles from './Ripanga.scss';

const RipangaStickyCells = ({
  collapsedIds,
  idKey,
  renderBodyStickyCell,
  renderGroupStickyCell = () => null,
  tableData
}) => {
  const renderBodyStickyCells = (group) => {
    if (group.key && collapsedIds[group.key.name] === true) {
      return [];
    }

    if (group.data[0][idKey] === undefined) {
      console.error(`Sticky cell renderer aborted: ID key '${idKey}' not found in row data.`); // eslint-disable-line
      return [];
    }

    return group.data.map(obj => (<div
      className={styles.stickyCell}
      key={`sticky-cell-${obj[idKey]}`}
    >
      {renderBodyStickyCell(obj)}
    </div>)
    );
  };

  const renderGroupStickyCells = () => {
    const cells = [];

    tableData.forEach((group) => {
      cells.push(renderGroupStickyCell(group));
      cells.push(renderBodyStickyCells(group));
    });

    return cells;
  };

  const isNotGrouped = (tableData.length === 1 && tableData[0].key === undefined);

  return (isNotGrouped
    ? renderBodyStickyCells(tableData[0].data)
    : renderGroupStickyCells());
};

RipangaStickyCells.propTypes = {
  collapsedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
  idKey: PropTypes.string,
  renderBodyStickyCell: PropTypes.func.isRequired,
  renderGroupStickyCell: PropTypes.func,
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default RipangaStickyCells;
