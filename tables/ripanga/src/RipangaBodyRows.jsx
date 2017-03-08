import React, { PropTypes } from 'react';
import styles from './Ripanga.scss';

import RipangaGroupRow from './RipangaGroupRow';
import RipangaBodyRow from './RipangaBodyRow';

const RipangaBodyRows = ({
  checkedIds,
  collapsedIds,
  columnDefinitions,
  idKey,
  isGrouped,
  onCollapse,
  onGroupCheck,
  onRowCheck,
  renderBodyRow,
  renderGroupTitle,
  showCheckboxes,
  tableData
}) => {
  const renderBodyRows = (group) => {
    if (group.key && collapsedIds[group.key.name] === true) {
      return [];
    }

    return group.data.map(rowData => (RipangaBodyRow({
      columnDefinitions,
      idKey,
      isChecked: checkedIds[rowData[idKey]],
      onCheck: onRowCheck,
      renderBodyRow,
      rowData,
      showCheckboxes
    })));
  };

  const renderGroupRow = (group) => {
    const initialColspan = (showCheckboxes ? 1 : 0);

    const colSpan = columnDefinitions
      .reduce((p, _, i, a) => (!a[i].hidden ? p + 1 : p), initialColspan);

    const titleElement = (renderGroupTitle === undefined
      ? (<span className={styles.title}>{group.key.name}</span>)
      : renderGroupTitle(group));

    const isChecked = group.data.reduce(
      (acc, rowData) => acc && (checkedIds[rowData[idKey]] || false), true);

    return (RipangaGroupRow({
      colSpan,
      groupData: group,
      isChecked,
      isCollapsed: collapsedIds[group.key.name],
      isDisabled: group.data.length === 0,
      onCollapse,
      onCheck: onGroupCheck,
      showCheckboxes,
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

  const rows = (isGrouped ? renderBodyGroups() : renderBodyRows(tableData[0]));

  return (<tbody>{rows}</tbody>);
};

/* eslint-disable react/require-default-props */
RipangaBodyRows.propTypes = {
  checkedIds: PropTypes.shape(),
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onCollapse: PropTypes.func,
  collapsedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
  idKey: PropTypes.string,
  isGrouped: PropTypes.bool,
  onGroupCheck: PropTypes.func,
  onRowCheck: PropTypes.func,
  renderBodyRow: PropTypes.func,
  renderGroupTitle: PropTypes.func,
  showCheckboxes: PropTypes.bool,
  tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default RipangaBodyRows;
