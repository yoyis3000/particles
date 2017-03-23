import React, { PropTypes } from 'react';
import cx from 'classnames';

import baseStyles from './CrudPermissionsTable.scss';
import defaultStyles from './CrudPermissionsTableDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

export default class CrudPermissionsTable extends React.Component {
  static propTypes = {
    bodyData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    headData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onCheck: PropTypes.func.isRequired,
    onGroupCheck: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape())
  };

  static defaultProps = {
    stylesheets: []
  };

  static renderHeadCells = (headData) => {
    const headCells = headData.map((obj, i) =>
    (<div className={cx(styles.headCell, styles[`cell${i}`])} key={`cell-${obj.id}`}>
      {obj.label}
    </div>));

    return <div className={styles.headRow}>{headCells}</div>;
  }

  static renderGroupRow = ({ isChecked, isCollapsed, key, onChange, onCollapse }) => (
    <div className={styles.groupTitleRow} key={`group-${key.id}`}>
      <div
        className={styles.caret}
        data-group-id={key.id}
        onClick={onCollapse}
      >
        <div className={cx(styles.triangle, { [styles.collapsed]: isCollapsed })} />
      </div>
      <div className={cx(styles.groupTitle, styles.cell0)}>{key.label}</div>
      <label className={styles.cell1}>
        <input type='checkbox' data-group-id={key.id} data-crud-type='create' checked={isChecked.create} {...{ onChange }} />
      </label>
      <label className={styles.cell2}>
        <input type='checkbox' data-group-id={key.id} data-crud-type='update' checked={isChecked.update} {...{ onChange }} />
      </label>
      <label className={styles.cell3}>
        <input type='checkbox' data-group-id={key.id} data-crud-type='delete' checked={isChecked.delete} {...{ onChange }} />
      </label>
    </div>
  );

  static renderBodyRows = ({ data, onChange }) => data.map(row =>
    (<div className={styles.bodyRow} key={`row-${row.id}`}>
      <div className={styles.cell0}>{row.label}</div>
      <label className={styles.cell1}>
        <input type='checkbox' data-row-id={row.id} data-crud-type='create' checked={row.create} {...{ onChange }} />
      </label>
      <label className={styles.cell2}>
        <input type='checkbox' data-row-id={row.id} data-crud-type='update' checked={row.update} {...{ onChange }} />
      </label>
      <label className={styles.cell3}>
        <input type='checkbox' data-row-id={row.id} data-crud-type='delete' checked={row.delete} {...{ onChange }} />
      </label>
    </div>));

  constructor(props) {
    super(props);
    this.state = {};
    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);
    this.refreshState(props.bodyData);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bodyData !== this.props.bodyData) {
      this.refreshState(nextProps.bodyData);
    }
  }

  onGroupCollapse = (evt) => {
    const id = evt.currentTarget.dataset.groupId;
    const { collapsedGroupIds } = this.state;
    collapsedGroupIds[id] = !collapsedGroupIds[id];
    this.setState({ collapsedGroupIds });
  }

  onGroupCheck = (evt) => {
    const { groupId, crudType } = evt.currentTarget.dataset;
    const { bodyData, checkedGroupIds } = this.state;
    const isChecked = checkedGroupIds[groupId][crudType];

    bodyData.forEach((group, groupIndex) => {
      if (group.key.id === groupId) {
        group.data.forEach((row, rowIndex) => {
          bodyData[groupIndex].data[rowIndex][crudType] = !isChecked;
        });

        this.props.onGroupCheck(bodyData[groupIndex].data.reduce((acc, curr) =>
          [...acc, { id: curr.id, type: crudType, value: curr[crudType] }], []));
      }
    });

    const updatedCheckedGroupIds = this.updateGroupCheckboxes(bodyData);
    this.setState({ bodyData, checkedGroupIds: updatedCheckedGroupIds });
  }

  onRowCheck = (evt) => {
    const { rowId, crudType } = evt.currentTarget.dataset;
    const { bodyData } = this.state;

    bodyData.forEach((group, groupIndex) => {
      group.data.forEach((row, rowIndex) => {
        if (row.id.toString() === rowId) {
          bodyData[groupIndex].data[rowIndex][crudType] =
            !bodyData[groupIndex].data[rowIndex][crudType];
          this.props.onCheck({
            id: rowId,
            type: crudType,
            value: bodyData[groupIndex].data[rowIndex][crudType]
          });
        }
      });
    });

    const checkedGroupIds = this.updateGroupCheckboxes(bodyData);
    this.setState({ bodyData, checkedGroupIds });
  }

  refreshState = (bodyData) => {
    const checkedGroupIds = this.updateGroupCheckboxes(bodyData);

    const collapsedGroupIds = bodyData
      .reduce((acc, group) => Object.assign(acc,
        { [group.key.id]: false })
        , {});

    this.setState({
      checkedGroupIds,
      collapsedGroupIds,
      bodyData
    });
  }

  updateGroupCheckboxes = bodyData => bodyData.reduce((acc, group) => {
    const groupCheckedState = group.data.reduce((acc2, row) =>
      Object.assign(acc2, {
        create: acc2.create && row.create,
        update: acc2.update && row.update,
        delete: acc2.delete && row.delete
      }), { create: true, update: true, delete: true });

    return Object.assign(acc, { [group.key.id]: groupCheckedState });
  }, {});

  render() {
    const { checkedGroupIds, collapsedGroupIds } = this.state;

    const headCells = CrudPermissionsTable.renderHeadCells(this.props.headData);

    const bodyCells = this.state.bodyData.reduce((acc, group) => {
      acc.push(CrudPermissionsTable.renderGroupRow({
        isChecked: checkedGroupIds[group.key.id],
        isCollapsed: collapsedGroupIds[group.key.id],
        key: group.key,
        onChange: this.onGroupCheck,
        onCollapse: this.onGroupCollapse
      }));

      if (collapsedGroupIds[group.key.id] === false) {
        acc.push(CrudPermissionsTable.renderBodyRows({
          data: group.data,
          onChange: this.onRowCheck
        }));
      }

      return acc;
    }, []);

    return (<div className={styles.container}>
      {headCells}
      {bodyCells}
    </div>);
  }
}
