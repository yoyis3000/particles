import React, { PropTypes } from 'react';
import styles from './Ripanga.scss';

import RipangaGroupRow from './RipangaGroupRow';
import RipangaBodyRow from './RipangaBodyRow';

const RipangaBodyRows = ({
  checkedIds,
  columnDefinitions,
  collapseGroup,
  collapsedGroups,
  globalKey,
  idKey,
  onCheck,
  renderBodyRow,
  renderGroupTitle,
  showCheckboxes,
  tableData
}) => {
  const renderBodyRows = (data, groupIndex = 0) => {
    if (collapsedGroups[groupIndex] === true) {
      return [];
    }

    return data.map(rowData => (RipangaBodyRow({
      checkedIds,
      columnDefinitions,
      globalKey,
      idKey,
      onCheck,
      renderBodyRow,
      rowData,
      showCheckboxes
    })));
  };

  const renderGroupRow = (groupData, groupIndex = 0) => {
    const initialVal = (showCheckboxes ? 1 : 0);

    const colSpan = columnDefinitions
      .reduce((p, _, i, a) => (!a[i].hidden ? p + 1 : p), initialVal);

    const titleElement = (renderGroupTitle === undefined
      ? (<span className={styles.title}>{groupData.key.name}</span>)
      : renderGroupTitle(groupData, groupIndex));

    return (RipangaGroupRow({
      checkedIds,
      collapseGroup,
      colSpan,
      globalKey,
      groupData,
      groupIndex,
      isCollapsed: collapsedGroups[groupIndex],
      isDisabled: groupData.data.length === 0,
      key: `group-row-${groupIndex}`,
      showCheckboxes,
      titleElement,
    }));
  };

  const renderBodyGroups = () => {
    const groups = [];
    tableData.forEach((groupData, index) => {
      groups.push(renderGroupRow(groupData, index));
      groups.push(...renderBodyRows(groupData.data, index));
    });

    return groups;
  };

  const isGrouped = (tableData.length > 0 && tableData[0].key !== undefined);

  const rows = (isGrouped
    ? renderBodyGroups()
    : renderBodyRows(tableData[0].data));

  return (<tbody>{rows}</tbody>);
};

RipangaBodyRows.propTypes = {
  checkedIds: PropTypes.shape(),
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collapseGroup: PropTypes.func,
  collapsedGroups: PropTypes.arrayOf(PropTypes.any).isRequired,
  globalKey: PropTypes.string.isRequired,
  idKey: PropTypes.string,
  onCheck: PropTypes.func,
  renderBodyRow: PropTypes.func,
  renderGroupTitle: PropTypes.func,
  showCheckboxes: PropTypes.bool.isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

RipangaBodyRows.defaultProps = {
  checkedIds: PropTypes.shape(),
  collapseGroup: null,
  idKey: 'id',
  onCheck: null,
  renderBodyRow: null,
  renderGroupTitle: null,
  renderGroupPaneContent: null
};

export default RipangaBodyRows;
