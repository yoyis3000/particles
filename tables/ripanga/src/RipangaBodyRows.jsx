import React, { PropTypes } from 'react';

import RipangaGroupRow from './RipangaGroupRow';
import RipangaBodyRow from './RipangaBodyRow';

const RipangaBodyRows = ({
  checkedIds,
  collapsedIds,
  columnDefinitions,
  idKey,
  onCollapse,
  onGroupCheck,
  onRowCheck,
  renderBodyCell,
  renderBodyRow,
  renderBodyStickyCell,
  renderGroupStickyCell,
  renderGroupTitle,
  showCheckboxes,
  showGroups,
  showSticky,
  styles,
  tableData
}) => {
  const renderBodyRows = (group) => {
    if (group.key && collapsedIds[group.key.key] === true) {
      return [];
    }

    return group.data.map(rowData => (RipangaBodyRow({
      columnDefinitions,
      idKey,
      isChecked: checkedIds[rowData[idKey]],
      onCheck: onRowCheck,
      renderBodyCell,
      renderBodyRow,
      renderBodyStickyCell,
      rowData,
      showCheckboxes,
      showGroups,
      showSticky,
      styles
    })));
  };

  const renderGroupRow = (group) => {
    const colSpan = columnDefinitions
      .reduce((p, _, i, a) => (!a[i].hidden ? p + 1 : p), 0);

    const titleElement = (renderGroupTitle === undefined
      ? (<span className={styles.title}>{group.key.label}</span>)
      : renderGroupTitle(group));

    const isChecked = group.data.reduce(
      (acc, rowData) => acc && (checkedIds[rowData[idKey]] || false), true);

    return (RipangaGroupRow({
      colSpan,
      groupData: group,
      isChecked,
      isCollapsed: collapsedIds[group.key.key],
      isDisabled: group.data.length === 0,
      onCollapse,
      onCheck: onGroupCheck,
      renderGroupStickyCell,
      showCheckboxes,
      showGroups,
      showSticky,
      styles,
      titleElement
    }));
  };

  const renderBodyGroups = () => {
    const groups = [];
    tableData.forEach((group) => {
      groups.push(renderGroupRow(group));
      groups.push(...renderBodyRows(group));
    });

    return groups;
  };

  const rows = (showGroups ? renderBodyGroups() : renderBodyRows(tableData[0]));

  return (<div className={styles.tableBody}>{rows}</div>);
};

/* eslint-disable react/require-default-props */
RipangaBodyRows.propTypes = {
  checkedIds: PropTypes.shape(),
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onCollapse: PropTypes.func,
  collapsedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
  idKey: PropTypes.string,
  onGroupCheck: PropTypes.func,
  onRowCheck: PropTypes.func,
  renderBodyCell: PropTypes.func,
  renderBodyRow: PropTypes.func,
  renderBodyStickyCell: PropTypes.func,
  renderGroupStickyCell: PropTypes.func,
  renderGroupTitle: PropTypes.func,
  showCheckboxes: PropTypes.bool.isRequired,
  showGroups: PropTypes.bool.isRequired,
  showSticky: PropTypes.bool.isRequired,
  styles: PropTypes.shape().isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default RipangaBodyRows;
