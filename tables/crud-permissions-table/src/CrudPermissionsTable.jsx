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

  static renderHeadCells = headData => headData.map((obj, i) =>
    (<div className={cx(styles.headCell, styles[`cell${i}`])} key={`cell-${obj.id}`}>
      {obj.label}
    </div>));

  static renderGroupRow = ({ isChecked, isCollapsed, key, onChange, onCollapse }) => (
    <div className={styles.groupTitleRow} key={`group-${key.id}`}>
      <div
        className={styles.caret}
        data-group-id={key.id}
        onClick={onCollapse}
        {...{ isCollapsed }}
      />
      <div className={styles.groupTitle}>{key.id}</div>
      <div className={styles.cell1}>
        <input type='checkbox' checked={isChecked.create} {...{ onChange }} />
      </div>
      <div className={styles.cell2}>
        <input type='checkbox' checked={isChecked.modify} {...{ onChange }} />
      </div>
      <div className={styles.cell3}>
        <input type='checkbox' checked={isChecked.delete} {...{ onChange }} />
      </div>
    </div>
  );

  static renderBodyRows = ({ data, onChange }) => data.map(row =>
    (<div className={styles.bodyRow} key={`row-${row.id}`}>
      <div className={styles.cell0}>{row.label}</div>
      <div className={styles.cell1}>
        <input type='checkbox' checked={row.create} {...{ onChange }} />
      </div>
      <div className={styles.cell2}>
        <input type='checkbox' checked={row.modify} {...{ onChange }} />
      </div>
      <div className={styles.cell3}>
        <input type='checkbox' checked={row.delete} {...{ onChange }} />
      </div>
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
    const id = evt.target.dataset.groupId;
    const { collapsedGroupIds } = this.state;
    collapsedGroupIds[id] = !collapsedGroupIds[id];
    this.setState({ collapsedGroupIds });
  }

  onGroupCheck = () => {
    const checkedGroupIds = this.updateGroupCheckboxes(this.state.bodyData);
    this.setState({ checkedGroupIds });
  }

  onRowCheck = () => {
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
