import React, { PropTypes } from 'react';
import styles from './Ripanga.scss';

import RipangaGroupRow from './RipangaGroupRow';
import RipangaBodyRow from './RipangaBodyRow';

const RipangaBodyRows = ({
  actions,
  checkedIds,
  columnDefinitions,
  collapsedGroups,
  globalKey,
  idKey,
  onCheck,
  renderBodyRow,
  renderGroupTitle,
  showCheckboxes,
  tableData,
  toggledGroups
}) => {
  const renderBodyRows = (data, groupIndex = 0) => {
    if (collapsedGroups[groupIndex] === true ||
      toggledGroups[groupIndex] === true) {
      return [];
    }

    return data.map(rowData => (RipangaBodyRow({
      actions,
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
    const { collapseGroup, toggleGroup } = actions;

    const initialVal = (showCheckboxes ? 1 : 0);

    const colSpan = columnDefinitions
      .reduce((p, _, i, a) => (!a[i].hidden ? p + 1 : p), initialVal);

    const titleElement = (renderGroupTitle === undefined
      ? (<span className={styles.title}>{groupData.key.name}</span>)
      : renderGroupTitle(groupData, groupIndex));

    return (<RipangaGroupRow
      key={`group-row-${groupIndex}`}
      isCollapsed={collapsedGroups.get(groupIndex)}
      isDisabled={groupData.data.length === 0}
      isToggled={toggledGroups.get(groupIndex)}
      // TODO make sure groups render
      {...{ actions, collapseGroup, colSpan, globalKey, groupIndex, showCheckboxes, titleElement, toggleGroup, groupData, checkedIds }}
    />);
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
  actions: PropTypes.shape(),
  checkedIds: PropTypes.shape(),
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collapsedGroups: PropTypes.arrayOf(PropTypes.any).isRequired,
  globalKey: PropTypes.string.isRequired,
  idKey: PropTypes.string,
  onCheck: PropTypes.func,
  renderBodyRow: PropTypes.func,
  renderGroupTitle: PropTypes.func,
  showCheckboxes: PropTypes.bool.isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  toggledGroups: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

RipangaBodyRows.defaultProps = {
  actions: PropTypes.shape(),
  checkedIds: PropTypes.shape(),
  idKey: 'id',
  onCheck: null,
  renderBodyRow: null,
  renderGroupTitle: null,
  renderGroupPaneContent: null
};

export default RipangaBodyRows;
