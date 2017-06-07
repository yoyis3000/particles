import React, { PropTypes } from 'react';
import cx from 'classnames';
import baseStyles from './Tipako.scss';
import composeStyles from '../../../shared/stylesheetComposer';

// https://stackoverflow.com/a/2117523/385273 (overly complex? Ben 170607)
/* eslint-disable no-bitwise */
function guidGenerator() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

export default class Tipako extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.shape({
        disabled: PropTypes.bool,
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        value: PropTypes.string.isRequired
      })),
      disabled: PropTypes.bool,
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      value: PropTypes.string.isRequired
    })),
    loading: PropTypes.bool,
    onClearAll: PropTypes.func,
    onSearch: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func,
    renderEmpty: PropTypes.func,
    renderGroup: PropTypes.func,
    renderItem: PropTypes.func,
    searchable: PropTypes.bool,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    titlePlaceholder: PropTypes.string,
    titleSlot: PropTypes.element,
    titleValue: PropTypes.string
  }

  static defaultProps = {
    data: [],
    loading: false,
    onSearch: null,
    onClearAll: null,
    onSelectAll: null,
    renderEmpty: null,
    renderGroup: null,
    renderItem: null,
    searchable: false,
    selectedKey: null,
    stylesheets: [],
    titlePlaceholder: 'Select...',
    titleSlot: null,
    titleValue: ''
  }

  constructor(props) {
    super(props);

    this.styles = composeStyles(baseStyles, [...props.stylesheets]);

    this.guid = guidGenerator();

    if (props.searchable === false && props.onSearch !== null) {
      console.error('An instance of Tipako has an "onSearch()" ' // eslint-disable-line
        + 'callback defined, but its "searchable" prop is false, '
        + 'so the callback will have no effect.');
    }

    this.state = {
      expanded: false,
      value: props.titleValue
    };
  }

  componentDidMount() {
    window.removeEventListener('click', this.onBlur);
    window.addEventListener('click', this.onBlur);
  }

  onSearch = (evt) => {
    const str = evt.target.value;
    this.setState({ value: str, expanded: true }, () => {
      if (this.props.onSearch) {
        this.props.onSearch(str);
      }
    });
  }

  onChildClick = (evt, child) => {
    evt.stopPropagation();

    if (child.disabled) {
      return;
    }

    this.props.onSelect(child);
    this.searchInput.focus();
  }

  onGroupClick = (evt, group) => {
    evt.stopPropagation();

    if (group.disabled) {
      return;
    }

    this.props.onSelect(group);
    this.searchInput.focus();
  }

  onUngroupedClick = (evt, item) => {
    evt.stopPropagation();

    if (item.disabled) {
      return;
    }

    this.props.onSelect(item);
    this.searchInput.focus();
  }

  onCaretClick = () => {
    if (this.state.expanded === false) {
      this.setState({ expanded: true, guid: this.guid });
    }
  }

  onSelectAll = () => {
    this.props.onSelectAll();
    this.setState({ expanded: false });
  }

  onClearAll = () => {
    this.props.onClearAll([]);
    this.setState({ expanded: false });
  }

  onSearchFocus = (evt) => {
    evt.target.select();
  }

  onBlur = () => {
    const expanded = (this.state.guid === this.guid);
    this.setState({ expanded, guid: null });
  };

  onInputBlur = () => {
    if (this.state.value.length === 0 && this.props.titleValue) {
      this.setState({ value: this.props.titleValue });
    }
  };

  onInputClear = (evt) => {
    evt.stopPropagation();

    if (this.props.onSearch) {
      this.props.onSearch('');
    }

    this.setState({ value: '' });
  }

  getEmptyString = () => {
    if (this.state.value) {
      return `No matches for "${this.state.value}".`;
    }

    return 'No items found.';
  }

  render() {
    const {
      data,
      loading,
      onClearAll,
      onSearch,
      onSelectAll,
      renderEmpty,
      renderGroup,
      renderItem,
      searchable,
      titlePlaceholder,
      titleSlot,
      titleValue
    } = this.props;

    const searchTerm = (searchable && this.state.value && !onSearch)
      ? this.state.value.toLowerCase()
      : '';

    const items = data.reduce((acc, v, i) => {
      // Grouped
      if (v.children) {
        const children = v.children.reduce((result, vv, ii) => {
          if (vv.value.toLowerCase().indexOf(searchTerm) === -1) {
            return result;
          }

          return result.concat(<button
            onClick={(evt) => { this.onChildClick(evt, vv); }}
            className={cx(this.styles.item, this.styles.childItem,
              { [this.styles.disabled]: vv.disabled })}
            key={`child-${v.key}-${vv.key}`}
          >
            {renderItem ? renderItem(vv, ii) : vv.value}
          </button>);
        }, []);

        if (children.length === 0 && v.value.toLowerCase().indexOf(searchTerm) === -1) {
          return acc;
        }

        const group = (<button
          onClick={(evt) => { this.onGroupClick(evt, v); }}
          className={cx(this.styles.item, this.styles.groupItem,
            { [this.styles.disabled]: v.disabled })}
          key={`group-${v.key}`}
        >
          {renderGroup ? renderGroup(v, i) : v.value}
        </button>);

        return acc.concat(group).concat(children);
      }

      if (v.value.toLowerCase().indexOf(searchTerm) === -1) {
        return acc;
      }

      // Ungrouped
      const ungrouped = (<button
        onClick={(evt) => { this.onUngroupedClick(evt, v); }}
        className={cx(this.styles.item, this.styles.ungroupedItem,
          { [this.styles.disabled]: v.disabled })}
        key={`ungrouped-${v.key}`}
      >
        {renderItem ? renderItem(v, i) : v.value}
      </button>);

      return acc.concat(ungrouped);
    }, []);

    const selectAll = (onSelectAll && items.length > 0)
      ? (<button className={this.styles.controlsButton} onClick={this.onSelectAll}>
           Select All
        </button>)
      : null;

    const clearAll = onClearAll
      ? (<button className={this.styles.controlsButton} onClick={this.onClearAll}>
          Clear All
        </button>)
      : null;

    const spacer = (clearAll && selectAll)
      ? <div className={this.styles.controlsSpacer}>/</div>
      : null;

    const controls = (<div className={this.styles.controls}>
      {selectAll}
      {spacer}
      {clearAll}
    </div>);

    const empty = (<div className={this.styles.empty}>
      {renderEmpty ? renderEmpty() : this.getEmptyString()}
    </div>);

    const caret = loading
      ? null
      : (<button onClick={this.onCaretClick} className={this.styles.caret}>
        <span className={cx('fa', 'fa-caret-down', this.styles.arrow, { [this.styles.expanded]: this.state.expanded })} />
      </button>);

    const clear = this.state.value && searchable
      ? <button onClick={this.onInputClear} className={this.styles.clear} />
      : null;

    const spinner = loading
      ? <span className={this.styles.spinner} />
      : null;

    const slot = titleSlot
      ? <div className={this.styles.slot}>{titleSlot}</div>
      : null;

    const search = searchable
      ? (<input
        className={this.styles.input}
        onBlur={this.onInputBlur}
        onChange={this.onSearch}
        onFocus={this.onSearchFocus}
        placeholder={titlePlaceholder}
        ref={(input) => { this.searchInput = input; }}
        type='text'
        value={this.state.value}
      />)
      : <div className={this.styles.staticText}>{titleValue || titlePlaceholder}</div>;

    return (<div className={this.styles.container}>
      <div className={cx(this.styles.title)}>
        {slot}
        {search}
        {clear}
        {caret}
        {spinner}
      </div>

      <div className={this.styles.dropdownContainer}>
        <div
          className={cx(this.styles.dropdown, {
            [this.styles.expanded]: this.state.expanded })}
        >
          {controls}
          <div className={this.styles.itemsContainer}>
            {items.length ? items : empty}
          </div>
        </div>
      </div>
    </div>);
  }
}
