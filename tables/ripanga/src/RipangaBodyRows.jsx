import PropTypes from 'prop-types';

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
  renderCell,
  renderGroupTitle,
  showCheckboxes,
  showGroups,
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
      renderCell,
      rowData,
      showCheckboxes,
      showGroups,
      styles
    })));
  };

  const renderGroupRow = (group) => {
    const isChecked = group.data.reduce(
      (acc, rowData) => acc && (checkedIds[rowData[idKey]] || false), true);

    return (RipangaGroupRow({
      groupData: group,
      isChecked,
      isCollapsed: collapsedIds[group.key.key],
      isDisabled: group.data.length === 0,
      onCollapse,
      onCheck: onGroupCheck,
      renderGroupTitle,
      showCheckboxes,
      showGroups,
      styles
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

  return (showGroups ? renderBodyGroups() : renderBodyRows(tableData[0]));
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
  renderCell: PropTypes.func,
  renderGroupTitle: PropTypes.func,
  showCheckboxes: PropTypes.bool.isRequired,
  showGroups: PropTypes.bool.isRequired,
  styles: PropTypes.shape().isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default RipangaBodyRows;
