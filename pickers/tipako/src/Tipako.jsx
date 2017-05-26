import React, { PropTypes } from 'react';
import cx from 'classnames';
import baseStyles from './Tipako.scss';
import defaultStyles from './TipakoDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

export default class Tipako extends React.Component {
  static propTypes = {
    addGroupTokens: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired
      })),
      text: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    })),
    groupIcon: PropTypes.string,
    itemIcon: PropTypes.string,
    maxResults: PropTypes.number,
    msgEmpty: PropTypes.string,
    msgPlaceholder: PropTypes.string,
    onFetch: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    prepopulate: PropTypes.bool,
    renderTokens: PropTypes.func,
    stylesheets: PropTypes.arrayOf(PropTypes.shape())
  }

  static defaultProps = {
    addGroupTokens: false,
    data: [],
    groupIcon: null,
    itemIcon: null,
    maxResults: Infinity,
    msgEmpty: 'No matching items.',
    msgPlaceholder: 'Search...',
    onFetch: null,
    prepopulate: false,
    renderTokens: null,
    stylesheets: []
  }

  constructor(props) {
    super(props);

    this.styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);
    this.timer = null;
    this.tokensMemo = {};

    this.state = {
      data: this.props.data || [],
      expanded: false,
      fetching: false,
      tokens: [],
      value: ''
    };
  }

  componentWillMount() {
    window.addEventListener('click', this.onBlur);
  }

  componentDidMount() {
    if (this.props.prepopulate && this.props.onFetch !== Tipako.defaultProps.onFetch) {
      this.props.onFetch('', (data) => {
        this.setState({ data, fetching: false });
      });
    }
  }

  onSearch = (evt) => {
    const str = evt.target.value;

    if (this.props.onFetch === Tipako.defaultProps.onFetch) {
      const data = this.props.data.reduce((acc, val) => {
        const matchText = val.text.toLowerCase().indexOf(str) !== -1;

        const matchChild = val.children &&
          val.children.reduce((result, child) =>
            result || (child.text.toLowerCase().indexOf(str) !== -1), false);

        if (matchText || matchChild) {
          return acc.concat(val);
        }

        return acc;
      }, []);

      this.setState({ data, expanded: true });
    } else {
      this.setState({ value: str, fetching: true });
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.props.onFetch(str, (data) => {
          this.setState({ data, expanded: true, fetching: false });
        });
      }, 500);
    }

    this.setState({ value: str });
  }

  onChildClick = (evt, child) => {
    evt.stopPropagation();

    if (child.disabled) {
      return;
    }

    const tokens = this.state.tokens;

    this.tokensMemo[child.id] = tokens.length;
    tokens.push(child);

    this.props.onSelect(tokens);
    this.searchInput.focus();
    this.setState({ tokens });
  }

  onGroupClick = (evt, group) => {
    evt.stopPropagation();

    if (group.disabled) {
      return;
    }

    const tokens = this.state.tokens;

    // Use child index stored in the memoisation to remove if exists. Ben 170222
    group.children.forEach((child) => {
      if (this.tokensMemo[child.id] !== undefined) {
        tokens.splice(this.tokensMemo[child.id], 1);
        delete this.tokensMemo[child.id];
      }
    });

    if (this.props.addGroupTokens) {
      this.tokensMemo[group.id] = tokens.length;
      tokens.push(group);
    }

    group.children.forEach((child) => {
      if (!child.disabled) {
        this.tokensMemo[child.id] = tokens.length;
        tokens.push(child);
      }
    });

    this.props.onSelect(tokens);
    this.searchInput.focus();
    this.setState({ tokens });
  }

  onUngroupedClick = (evt, ungrouped) => {
    evt.stopPropagation();

    if (ungrouped.disabled) {
      return;
    }

    const tokens = this.state.tokens;
    this.tokensMemo[ungrouped.id] = tokens.length;
    tokens.push(ungrouped);

    this.props.onSelect(tokens);
    this.searchInput.focus();
    this.setState({ tokens });
  }

  onTokenClick = (obj) => {
    const tokens = this.state.tokens;
    tokens.splice(this.tokensMemo[obj.id], 1);
    delete this.tokensMemo[obj.id];

    tokens.forEach((t, i) => {
      this.tokensMemo[t.id] = i;
    });

    this.props.onSelect(Object.values(tokens));
    this.setState({ tokens, expanded: false });
  }

  onCaretClick = (evt) => {
    evt.stopPropagation();
    this.setState({ expanded: true });
  }

  onSelectAll = () => {
    const { addGroupTokens } = this.props;

    const tokens = this.state.data.reduce((acc, obj) => {
      const result = acc;

      if (obj.children) {
        if (addGroupTokens && !obj.disabled) {
          this.tokensMemo[obj.id] = result.length;
          result.push(obj);
        }

        obj.children.forEach((child) => {
          if (!child.disabled) {
            this.tokensMemo[child.id] = result.length;
            result.push(child);
          }
        });
      } else if (!obj.disabled) {
        this.tokensMemo[obj.id] = result.length;
        result.push(obj);
      }

      return result;
    }, []);

    this.props.onSelect(Object.values(tokens));
    this.setState({ tokens, expanded: false });
  }

  onClearAll = () => {
    this.props.onSelect([]);
    Object.keys(this.tokensMemo).forEach((k) => { delete this.tokensMemo[k]; });
    this.setState({ tokens: [], expanded: false });
  }

  onBlur = () => {
    this.setState({ expanded: false });
  };

  render() {
    const itemIcon = this.props.itemIcon
      ? <img alt='Item' src={this.props.itemIcon} className={this.styles.itemIcon} />
      : null;

    const groupIcon = this.props.groupIcon
      ? <img alt='Group' src={this.props.groupIcon} className={this.styles.itemIcon} />
      : null;

    const items = this.state.data.reduce((acc, v) => {
      // Grouped
      if (v.children) {
        const children = v.children.reduce((result, vv) => {
          if (this.tokensMemo[vv.id] !== undefined) {
            return result;
          }

          return result.concat(<button
            onClick={(evt) => { this.onChildClick(evt, vv); }}
            className={cx(this.styles.item, this.styles.childItem, { [this.styles.disabled]: vv.disabled })}
            key={`child-${v.id}-${vv.id}`}
          >
            {itemIcon}
            {vv.text}
          </button>);
        }, []);

        if (this.props.addGroupTokens === false && children.length === 0) {
          return acc;
        }

        if (this.tokensMemo[v.id] !== undefined && children.length === 0) {
          return acc;
        }

        const group = (<button
          onClick={(evt) => { this.onGroupClick(evt, v); }}
          className={cx(this.styles.item, this.styles.groupItem, { [this.styles.disabled]: v.disabled })}
          key={`group-${v.id}`}
        >
          {groupIcon}
          {v.text}
        </button>);

        return acc.concat(group).concat(children);
      }

      // Ungrouped
      if (this.tokensMemo[v.id] !== undefined) {
        return acc;
      }

      const ungrouped = (<button
        onClick={(evt) => { this.onUngroupedClick(evt, v); }}
        className={cx(this.styles.item, this.styles.ungroupedItem, { [this.styles.disabled]: v.disabled })}
        key={`ungrouped-${v.id}`}
      >
        {itemIcon}
        {v.text}
      </button>);

      return acc.concat(ungrouped);
    }, []);

    const selectAll = items.length > 0
      ? (<button
        className={this.styles.controlsButton}
        onClick={this.onSelectAll}
      >
         Select All
      </button>)
      : null;

    const spacer = items.length > 0
      ? <div className={this.styles.controlsSpacer}>/</div>
      : null;

    const controls = (<div className={this.styles.controls}>
      {selectAll}
      {spacer}
      <button
        className={this.styles.controlsButton}
        onClick={this.onClearAll}
      >
        Clear All
      </button>
    </div>);

    const tokens = this.props.renderTokens
       ? this.props.renderTokens(this.state.tokens, this.onTokenClick)
       : this.state.tokens.map(val => (<button
         className={this.styles.token}
         key={`token-${val.id}`}
         onClick={() => { this.onTokenClick(val); }}
       >
         {val.text}
       </button>));

    const nomatch = <div className={this.styles.nomatch}>{this.props.msgEmpty}</div>;

    const caret = (this.state.fetching)
      ? null
      : (<button onClick={this.onCaretClick} className={this.styles.caret}>
        <span className={cx('fa', 'fa-caret-down', this.styles.arrow, { [this.styles.expanded]: this.state.expanded })} />
      </button>);

    const busy = this.state.fetching
      ? <span className={this.styles.busy} />
      : null;

    const maxResultsWarningIcon =
      (this.state.fetching || this.state.data.length < this.props.maxResults)
      ? null
      : <span className={`fa fa-exclamation-triangle ${this.styles.maxResults}`} />;

    const maxResultsWarningText =
      (this.state.fetching || this.state.data.length < this.props.maxResults)
      ? ''
      : 'This search is too general, so the results have been limited.';

    return (<div
      className={this.styles.picker}
      title={maxResultsWarningText}
    >
      {tokens}

      <div className={cx(this.styles.inputContainer)}>
        <input
          className={this.styles.input}
          type='text'
          placeholder={this.props.msgPlaceholder}
          value={this.state.value}
          onChange={this.onSearch}
          ref={(input) => { this.searchInput = input; }}
        />
        {caret}
        {busy}
        {maxResultsWarningIcon}
      </div>

      <div className={this.styles.dropdownContainer}>
        <div
          className={cx(this.styles.dropdown, {
            [this.styles.expanded]: this.state.expanded })}
        >
          {controls}
          {items.length ? items : nomatch}
        </div>
      </div>
    </div>);
  }
}
