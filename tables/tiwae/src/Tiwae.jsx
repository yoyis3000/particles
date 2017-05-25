import React from 'react';
import PropTypes from 'prop-types';
import baseStyles from './Tiwae.scss';
import defaultStyles from './TiwaeDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

export default class Tiwae extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    defaultColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isSelectAll: PropTypes.bool,
    lockLimit: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape())
  };

  static defaultProps = {
    lockLimit: 3,
    isSelectAll: false,
    stylesheets: []
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);

    const columns = props.columns.map(option => Object.assign(option, {
      hidden: option.hidden || false,
      locked: option.locked || false
    }));

    const isAllChecked = columns.every(column => !column.hidden);

    this.state = {
      isAllChecked,
      columns,
      expanded: false,
      ghostIndex: -1,
      startIndex: -1
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.onBlur);
  }

  onDragStart = (evt) => {
    if (evt.dataTransfer) {
      evt.dataTransfer.setData('text', 'placeholder-data'); // eslint-disable-line
    }
    this.setState({ startIndex: evt.currentTarget.dataset.index });
  }

  onDragOverBody = (evt) => {
    evt.preventDefault();
  }

  onDragOverElement = (evt) => {
    evt.preventDefault();

    const lastLocked = this.state.columns.reduce((acc, option, i) => (option.locked ? i : acc), -1);
    const index = parseInt(evt.currentTarget.dataset.index, 10);

    if (index > lastLocked) {
      this.setState({ ghostIndex: evt.currentTarget.dataset.index });
    }
  }

  onDrop = (evt) => {
    evt.preventDefault();

    const { columns, ghostIndex, startIndex } = this.state;

    const lastLocked = columns.reduce((acc, option, i) => (option.locked ? i : acc), -1);

    if (ghostIndex > lastLocked) {
      const originalElement = columns.splice(startIndex, 1);
      columns.splice(ghostIndex, 0, originalElement[0]);
    }

    this.setState({ ghostIndex: -1, startIndex: -1, columns });
    this.props.onChange(columns);
  }

  onCheck = (evt) => {
    evt.stopPropagation();

    const index = evt.currentTarget.dataset.index;
    const { columns } = this.state;
    columns[index].hidden = !columns[index].hidden;

    const isAllChecked = this.state.columns.every(column => !column.hidden);

    this.setState({ columns, ghostIndex: -1, startIndex: -1, isAllChecked });
    this.props.onChange(columns);
  }

  onSelectAll = () => {
    const isAllChecked = !this.state.isAllChecked;

    this.setState({ isAllChecked });
    this.props.onSelectAll(isAllChecked);
  };

  onLock = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const index = evt.currentTarget.dataset.index * 1;

    const columns = this.state.columns
      .map((option, i) => {
        if (i === index) {
          return Object.assign(option, { locked: !option.locked });
        }

        if (i < index) {
          return Object.assign(option, { locked: true });
        }

        return Object.assign(option, { locked: false });
      });

    this.setState({ columns });
    this.props.onChange(columns);
  }

  onReset = () => {
    const columns = this.props.defaultColumns.map(option => Object.assign(option, {
      hidden: false,
      locked: false
    }));

    const isAllChecked = this.state.columns.every(column => !column.hidden);

    this.setState({ ghostIndex: -1, columns, startIndex: -1, isAllChecked });
    this.props.onChange(columns);
  }

  onItemClick = (evt) => {
    evt.stopPropagation();
  }

  onBlur = () => {
    this.setState({ expanded: false, ghostIndex: -1, startIndex: -1 });
  }

  onExpand = (evt) => {
    evt.stopPropagation();
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const {
      ghostIndex,
      columns,
      startIndex
    } = this.state;

    const selectAll = this.props.isSelectAll
    ? (<div className={styles.selectAll} onClick={this.onSelectAll}>
      <input
        checked={this.state.isAllChecked}
        className={styles.itemCheckbox}
        onChange={this.onSelectAll}
        type='checkbox'
      />
      <div className={styles.itemLabel}>Select All</div>
      <span className={styles.controlDivider}>|</span>)
    </div>)
    : null;

    const controls = (<div className={styles.controls}>
      {selectAll}
      <div className={styles.reset} onClick={this.onReset} >Reset to Default</div>
    </div>);

    const items = columns.map((option, index) => {
      const lock = (index < this.props.lockLimit && (index === 0 || columns[index - 1].locked))
        ? (<div
          className={`fa
            ${option.locked ? 'fa-lock' : 'fa-unlock'}
            ${option.locked ? styles.isLocked : ''}
            ${styles.itemLock}`}
          data-index={index}
          onClick={this.onLock}
        />)
        : (<div className={styles.itemLockPlaceholder} />);

      return (<label
        className={`${styles.item} ${option.locked ? styles.locked : ''} ${(startIndex * 1) === index ? styles.grab : ''}`}
        data-index={index}
        draggable={!option.locked}
        key={`item-${option.key}`}
        onClick={this.onItemClick}
        onDragOver={this.onDragOverElement}
        onDragStart={this.onDragStart}
      >
        <input
          checked={!option.hidden}
          className={styles.itemCheckbox}
          data-index={index}
          onChange={this.onCheck}
          type='checkbox'
        />
        <div className={styles.itemLabel}>{option.label}</div>
        {lock}
      </label>);
    });

    if (this.state.ghostIndex > -1) {
      const index = (ghostIndex > startIndex) ? (parseInt(ghostIndex, 10) + 1) : ghostIndex;
      items.splice(index, 0, <div key='ghost' className={styles.ghost} />);
    }

    return (
      <div className={styles.container}>
        <div className={`${styles.button} fa fa-ellipsis-v`} onClick={this.onExpand} />
        <div className={`${styles.dropdownContainer} ${this.state.expanded ? styles.expanded : ''}`}>
          <div className={styles.dropdownTriangle} />
          <div
            className={styles.dropdownHead}
            onClick={this.onItemClick}
          >
            <div className={styles.title}>Show, Hide, or Reorder Columns</div>
            {controls}
          </div>
          <div
            className={styles.dropdownBody}
            onDragOver={this.onDragOverBody}
            onDrop={this.onDrop}
          >
            {items}
          </div>
        </div>
      </div>
    );
  }
}
