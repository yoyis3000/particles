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
      <label className={styles.cell1} checked={isChecked.create} {...{ onChange }}>
        <input type='checkbox' />
      </label>
      <label className={styles.cell2} checked={isChecked.modify} {...{ onChange }}>
        <input type='checkbox' />
      </label>
      <label className={styles.cell3} checked={isChecked.delete} {...{ onChange }}>
        <input type='checkbox' />
      </label>
    </div>
  );

  static renderBodyRows = ({ data, onChange }) => data.map(row =>
    (<div className={styles.bodyRow} key={`row-${row.id}`}>
      <div className={styles.cell0}>{row.label}</div>
      <label className={styles.cell1}>
        <input type='checkbox' checked={row.create} {...{ onChange }} />
      </label>
      <label className={styles.cell2}>
        <input type='checkbox' checked={row.modify} {...{ onChange }} />
      </label>
      <label className={styles.cell3}>
        <input type='checkbox' checked={row.delete} {...{ onChange }} />
      </label>
    </div>));

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);

    const { bodyData } = props;

    const checkedGroupIds = this.updateGroupCheckboxes(bodyData);

    const collapsedGroupIds = bodyData
      .reduce((acc, group) => Object.assign(acc,
        { [group.key.id]: false })
        , {});

    this.state = {
      checkedGroupIds,
      collapsedGroupIds,
      bodyData
    };
  }

  onGroupCollapse = (evt) => {
    const id = evt.currentTarget.dataset.groupId;
    const { collapsedGroupIds } = this.state;
    collapsedGroupIds[id] = !collapsedGroupIds[id];
    this.setState({ collapsedGroupIds });
  }

  onGroupCheck = () => {
    console.warn("GROUP CHECKED")
    const checkedGroupIds = this.updateGroupCheckboxes(this.state.bodyData);
    this.setState({ checkedGroupIds });
  }

  onRowCheck = () => {
    console.warn("ROW CHECKED")
    const checkedGroupIds = this.updateGroupCheckboxes(this.state.bodyData);
    this.setState({ checkedGroupIds });
  }

  updateGroupCheckboxes = bodyData => bodyData.reduce((acc, group) => {
    const groupCheckedState = group.data.reduce((acc2, row) =>
      Object.assign(acc2, {
        create: acc2.create && row.create,
        modify: acc2.modify && row.modify,
        delete: acc2.delete && row.delete
      }), { create: true, modify: true, delete: true });

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
