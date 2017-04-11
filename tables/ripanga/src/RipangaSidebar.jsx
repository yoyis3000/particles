import React, { PropTypes } from 'react';

const RipangaSidebar = ({
  idKey,
  renderBodyStickyCell,
  renderGroupStickyCell,
  renderHeadStickyCell,
  showGroups,
  styles,
  tableData
}) => {
  const renderSidebarCell = group => group.data.map((rowData) => {
    const sticky = renderBodyStickyCell ? renderBodyStickyCell(rowData) : null;
    return <div key={`${rowData[idKey]}-sticky`} className={styles.sidebarCell}>{sticky}</div>;
  });

  const renderGroupSidebarCell = (groupData) => {
    const sticky = (renderGroupStickyCell ? renderGroupStickyCell(groupData) : null);
    return <div key={`group-sticky-${groupData.key.key}`} className={styles.groupSidebarCell}>{sticky}</div>;
  }

  const renderGroupSidebarCells = () => {
    const groups = [];
    tableData.forEach((group) => {
      groups.push(renderGroupSidebarCell(group));
      groups.push(...renderSidebarCell(group));
    });

    return groups;
  };

  const rows = (showGroups ? renderGroupSidebarCells() : renderSidebarCell(tableData[0]));

  const headSticky = renderHeadStickyCell ? renderHeadStickyCell() : null;
  rows.unshift(<div key='sticky-head' className={styles.headSidebarCell}>{headSticky}</div>);

  return rows;
};

/* eslint-disable react/require-default-props */
RipangaSidebar.propTypes = {
  idKey: PropTypes.string,
  renderBodyStickyCell: PropTypes.func,
  renderHeadStickyCell: PropTypes.func,
  renderGroupStickyCell: PropTypes.func,
  styles: PropTypes.shape().isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default RipangaSidebar;
