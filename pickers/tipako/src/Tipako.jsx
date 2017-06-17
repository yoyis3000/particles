import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import baseStyles from './Tipako.scss';
import composeStyles from '../../../shared/stylesheetComposer';
import generateId from '../../../shared/generateId';

export default class Tipako extends React.Component {
  static propTypes = {
    closeOnSelect: PropTypes.bool,
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
    keyField: PropTypes.string,
    loading: PropTypes.bool,
    onClear: PropTypes.func,
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
    titleValue: PropTypes.string,
    updateOnSelect: PropTypes.bool,
    valueField: PropTypes.string
  }

  static defaultProps = {
    closeOnSelect: false,
    data: [],
    keyField: 'key',
    loading: false,
    onSearch: null,
    onClear: null,
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
    titleValue: '',
    updateOnSelect: false,
    valueField: 'value'
  }

  constructor(props) {
    super(props);

    this.styles = composeStyles(baseStyles, [...props.stylesheets]);

    this.guid = generateId();

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

  componentWillMount() {
    window.addEventListener('click', this.onBlur);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onBlur);
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

    if (this.props.closeOnSelect) {
      this.setState({ expanded: false });
    }

    if (this.props.updateOnSelect) {
      this.setState({ value: child[this.props.valueField] });
    }

    if (this.props.searchable) {
      this.searchInput.focus();
    }
  }

  onGroupClick = (evt, group) => {
    evt.stopPropagation();

    if (group.disabled) {
      return;
    }

    this.props.onSelect(group);

    if (this.props.closeOnSelect) {
      this.setState({ expanded: false });
    }

    if (this.props.updateOnSelect) {
      this.setState({ value: group[this.props.valueField] });
    }

    if (this.props.searchable) {
      this.searchInput.focus();
    }
  }

  onUngroupedClick = (evt, item) => {
    evt.stopPropagation();

    if (item.disabled) {
      return;
    }

    this.props.onSelect(item);

    if (this.props.closeOnSelect) {
      this.setState({ expanded: false });
    }

    if (this.props.updateOnSelect) {
      this.setState({ value: item[this.props.valueField] });
    }

    if (this.props.searchable) {
      this.searchInput.focus();
    }
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

    if (this.props.onClear) {
      this.props.onClear();
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
      keyField,
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
      titleValue,
      valueField
    } = this.props;

    const { value } = this.state;

    const searchTerm = (searchable && value && !onSearch)
      ? value.toLowerCase()
      : '';

    const items = data.reduce((acc, v, i) => {
      // Grouped
      if (v.children) {
        const children = v.children.reduce((result, vv, ii) => {
          if (vv[valueField].toLowerCase().indexOf(searchTerm) === -1) {
            return result;
          }

          return result.concat(<button
            onClick={(evt) => { this.onChildClick(evt, vv); }}
            className={cx(this.styles.item, this.styles.childItem,
              { [this.styles.disabled]: vv.disabled })}
            key={`child-${v[keyField]}-${vv[keyField]}`}
          >
            {renderItem ? renderItem(vv, ii) : vv[valueField]}
          </button>);
        }, []);

        if (children.length === 0 && v[valueField].toLowerCase().indexOf(searchTerm) === -1) {
          return acc;
        }

        const group = (<button
          onClick={(evt) => { this.onGroupClick(evt, v); }}
          className={cx(this.styles.item, this.styles.groupItem,
            { [this.styles.disabled]: v.disabled })}
          key={`group-${v[keyField]}`}
        >
          {renderGroup ? renderGroup(v, i) : v[valueField]}
        </button>);

        return acc.concat(group).concat(children);
      }

      if (v[valueField].toLowerCase().indexOf(searchTerm) === -1) {
        return acc;
      }

      // Ungrouped
      const ungrouped = (<button
        onClick={(evt) => { this.onUngroupedClick(evt, v); }}
        className={cx(this.styles.item, this.styles.ungroupedItem,
          { [this.styles.disabled]: v.disabled })}
        key={`ungrouped-${v[keyField]}`}
      >
        {renderItem ? renderItem(v, i) : v[valueField]}
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

    const clear = value
      ? <button onClick={this.onInputClear} className={this.styles.clear} />
      : null;

    const spinner = loading
      ? <span className={this.styles.spinner} />
      : null;

    const slot = titleSlot
      ? <div className={this.styles.slot}>{titleSlot}</div>
      : null;

    const search = searchable
      ? (
        <input
          className={this.styles.input}
          onBlur={this.onInputBlur}
          onChange={this.onSearch}
          onFocus={this.onSearchFocus}
          placeholder={titlePlaceholder}
          ref={(input) => { this.searchInput = input; }}
          type='text'
          value={value}
        />
        )
      : (
        <div className={this.styles.staticText} onClick={this.onCaretClick}>
          {(value.length > 0 && value) || titleValue || titlePlaceholder}
        </div>
      );

    return (
      <div className={cx(this.styles.container, { [this.styles.active]: this.state.expanded })}>
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
      </div>
    );
  }
}
