import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import baseStyles from './Select.scss';
import defaultStyles from './SelectDefault.scss';

import composeStyles from '../../../../shared/stylesheetComposer';

let timer = null;
let styles = {};
const tokensMemo = {};

export default class Select extends Component {
  static propTypes = {
    addGroupTokens: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.object),
    expanded: PropTypes.bool,
    fetching: PropTypes.bool,
    groupIcon: PropTypes.string,
    itemIcon: PropTypes.string,
    msgEmpty: PropTypes.string,
    onChange: PropTypes.func,
    onFetch: PropTypes.func,
    placeholder: PropTypes.string,
    stylesheets: PropTypes.arrayOf(PropTypes.any),
    textField: PropTypes.string
  }

  static defaultProps = {
    addGroupTokens: false,
    data: [],
    expanded: false,
    fetching: false,
    groupIcon: null,
    itemIcon: null,
    msgEmpty: 'No results!',
    onChange: () => {},
    onFetch: () => {},
    placeholder: 'Search...',
    stylesheets: [],
    textField: 'text'
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);

    this.state = {
      data: props.data,
      expanded: props.expanded,
      fetching: props.fetching,
      value: null
    };
  }

  componentWillMount() {
    window.addEventListener('click', this.onBlur);
  }

  componentDidMount() {
    if (this.props.onFetch !== Select.defaultProps.onFetch) {
      this.props.onFetch('', (data) => {
        this.setState({ data, fetching: false });
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onBlur);
  }

  onBlur = () => { this.setState({ expanded: false }); }

  onCaretClick = (evt) => {
    evt.stopPropagation();
    this.setState({ expanded: !this.state.expanded });
  }

  onChildClick = (evt, child) => {
    evt.stopPropagation();

    if (child.disabled) { return; }

    this.props.onChange(child);
    this.searchInput.focus();
    this.setState({ value: child[this.props.textField], expanded: false });
  }

  onRemove = () => {
    this.props.onChange({ value: null });
    this.setState({ value: null });
  }

  onSearch = (evt) => {
    const {
      data: itemData,
      onFetch,
      textField
    } = this.props;
    const str = evt.target.value;

    if (onFetch === Select.defaultProps.onFetch) {
      const data = itemData.reduce((acc, val) => {
        const matchText = val[textField].toLowerCase().indexOf(str.toLowerCase()) !== -1;
        const matchChild = val.children &&
          val.children.reduce((result, child) =>
            result || (child[textField].toLowerCase().indexOf(str.toLowerCase()) !== -1), false);

        if (matchText || matchChild) {
          return acc.concat(val);
        }

        return acc;
      }, []);

      this.setState({ data, expanded: true });
    } else {
      this.setState({ value: str, fetching: true });
      clearTimeout(timer);

      timer = setTimeout(() => {
        this.props.onFetch(str, (data) => {
          this.setState({ data, expanded: true, fetching: false });
        });
      }, 500);
    }

    this.setState({ value: str });
  }

  render() {
    const busy = this.state.fetching
    ? <span className={styles.busy} />
    : null;

    const caret = this.state.fetching
      ? null
      : (
        <button onClick={this.onCaretClick} className={styles.caret}>
          <span className={cx('fa', 'fa-caret-down', styles.arrow, { [styles.expanded]: this.state.expanded })} />
        </button>
      );

    const groupIcon = this.props.groupIcon
      ? <img alt='Group' src={this.props.groupIcon} className={styles.itemIcon} />
      : null;

    const itemIcon = this.props.itemIcon
      ? <img alt='Item' src={this.props.itemIcon} className={styles.itemIcon} />
      : null;

    const items = this.state.data.reduce((acc, v) => {
      // Grouped
      if (v.children) {
        const children = v.children.reduce((result, vv) => {
          if (tokensMemo[vv.id] !== undefined) { return result; }

          return result.concat(<button
            onClick={(evt) => { this.onChildClick(evt, vv); }}
            className={cx(styles.item, styles.childItem, { [styles.disabled]: vv.disabled })}
            key={`item-${vv.id}`}
          >
            {itemIcon}
            {vv[this.props.textField]}
          </button>);
        }, []);

        if (!this.props.addGroupTokens && children.length === 0) { return acc; }

        if (tokensMemo[v.id] !== undefined && children.length === 0) { return acc; }

        const group = (
          <button
            className={cx(styles.item, styles.groupItem, styles.disabled)}
            key={`item-${v.id}`}
          >
            {groupIcon}
            {v[this.props.textField]}
          </button>
        );

        return acc.concat(group).concat(children);
      }

      // Ungrouped
      if (tokensMemo[v.id] !== undefined) {
        return acc;
      }

      const ungrouped = (
        <button
          onClick={(evt) => { this.onChildClick(evt, v); }}
          className={cx(styles.item, styles.ungroupedItem, { [styles.disabled]: v.disabled })}
          key={`item-${v.id}`}
        >
          {itemIcon}
          {v[this.props.textField]}
        </button>
      );

      return acc.concat(ungrouped);
    }, []);

    const nomatch = <div className={styles.nomatch}>{this.props.msgEmpty}</div>;

    const removeButton =
      this.state.value
      ? <button type='button' className={`fa fa-times ${styles.removeButton}`} onClick={this.onRemove} />
      : null;

    return (
      <div className={styles.picker}>
        <div className={cx(styles.inputContainer)}>
          <input
            className={styles.input}
            onChange={this.onSearch}
            placeholder={this.props.placeholder}
            ref={(input) => { this.searchInput = input; }}
            type='text'
            value={this.state.value}
          />
          {removeButton}
          {caret}
          {busy}
        </div>

        <div className={styles.dropdownContainer}>
          <div className={cx(styles.dropdown, { [styles.expanded]: this.state.expanded })}>
            {items.length > 0 ? items : nomatch}
          </div>
        </div>
      </div>
    );
  }
}
