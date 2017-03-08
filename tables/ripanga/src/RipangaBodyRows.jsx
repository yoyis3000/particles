import React, { PropTypes } from 'react';
import styles from './Ripanga.scss';

import RipangaGroupRow from './RipangaGroupRow';
import RipangaBodyRow from './RipangaBodyRow';

const RipangaBodyRows = ({
  // checkedIds,
  collapsedIds,
  columnDefinitions,
  globalKey,
  idKey,
  isGrouped,
  // onCheck,
  onCollapse,
  renderBodyRow,
  renderGroupTitle,
  tableData
}) => {
  const renderBodyRows = (groupData) => {
    if (groupData.key && collapsedIds[groupData.key.name] === true) {
      return [];
    }

    return groupData.data.map(rowData => (RipangaBodyRow({
      columnDefinitions,
      globalKey,
      idKey,
      // isChecked: checkedIds[rowData[idKey]],
      // onCheck,
      renderBodyRow,
      rowData
    })));
  };

  const renderGroupRow = (groupData) => {
    // const initialVal = (showCheckboxes ? 1 : 0);
    const initialVal = 0;

    const colSpan = columnDefinitions
      .reduce((p, _, i, a) => (!a[i].hidden ? p + 1 : p), initialVal);

    const titleElement = (renderGroupTitle === undefined
      ? (<span className={styles.title}>{groupData.key.name}</span>)
      : renderGroupTitle(groupData, groupIndex));

    return (RipangaGroupRow({
      // checkedIds,
      // showCheckboxes,
      colSpan,
      globalKey,
      groupData,
      isCollapsed: collapsedIds[groupData.key.name],
      isDisabled: groupData.data.length === 0,
      key: `group-row-${groupData.key.name}`,
      onCollapse,
      titleElement
    }));
  };

  const renderBodyGroups = () => {
    const groups = [];
    tableData.forEach((groupData) => {
      groups.push(renderGroupRow(groupData));
      groups.push(...renderBodyRows(groupData));
    });

    return groups;
  };

  const rows = (isGrouped ? renderBodyGroups() : renderBodyRows(tableData[0]));

  return (<tbody>{rows}</tbody>);
};

/* eslint-disable react/require-default-props */
RipangaBodyRows.propTypes = {
  // checkedIds: PropTypes.shape(),
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onCollapse: PropTypes.func,
  collapsedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
  globalKey: PropTypes.string.isRequired,
  idKey: PropTypes.string,
  // onCheck: PropTypes.func,
  renderBodyRow: PropTypes.func,
  renderGroupTitle: PropTypes.func,
  tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default RipangaBodyRows;
