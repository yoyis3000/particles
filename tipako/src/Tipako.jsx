import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './Tipako.scss';
import procoreStyles from './TipakoProcore.scss';
import procoreOverrides from './TipakoProcoreOverrides.scss';

let timer = null;

export default class Tipako extends React.Component {
  static propTypes = {
    addGroupTokens: PropTypes.bool,
    className: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
      })),
      text: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    })),
    groupIcon: PropTypes.string,
    itemIcon: PropTypes.string,
    maxResults: PropTypes.number,
    msgEmpty: PropTypes.string,
    msgPlaceholder: PropTypes.string,
    onFetch: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    renderTokens: PropTypes.func,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
  }

  static defaultProps = {
    addGroupTokens: false,
    className: '',
    data: [],
    groupIcon: null,
    itemIcon: null,
    maxResults: Math.Infinite,
    msgEmpty: 'No matching items.',
    msgPlaceholder: 'Search...',
    onFetch: () => {},
    renderTokens: null,
    stylesheets: [],
  }

  constructor(props) {
    super(props);

    // TEMPORARY...? Ben 170217
    props.stylesheets.push(procoreStyles);
    props.stylesheets.push(procoreOverrides);

    props.stylesheets.forEach((s) => {
      Object.keys(s).forEach((k) => {
        if (styles[k] && s[k]) {
          styles[k] = styles[k].split(' ').concat(s[k].split(' ')).join(' ');
        }
      });
    });

    this.state = {
      data: this.props.data || [],
      expanded: false,
      fetching: false,
      tokens: {},
      value: '',
    };
  }

  componentWillMount() {
    window.addEventListener('click', this.onBlur);
  }

  componentDidMount() {
    this.props.onFetch('', (data) => {
      this.setState({ data, fetching: false });
    });
  }

  onSearch = (evt) => {
    const str = evt.target.value;

    if (this.props.onFetch === undefined) {
      const data = this.props.data.reduce((acc, val) => {
        const matchText = val.text.toLowerCase().indexOf(str) !== -1;

        const matchChild = val.children ||
          val.children.reduce((result, child) => {
            return result || (child.text.toLowerCase().indexOf(str) !== -1);
          }, false);

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

  onChildClick = (obj) => {
    const tokens = this.state.tokens;
    tokens[obj.id] = obj;

    this.setState({ tokens, expanded: false, value: '' });
  }

  onGroupClick = (obj) => {
    const tokens = this.state.tokens;

    if (this.props.addGroupTokens) {
      tokens[obj.id] = obj;
    }

    obj.children.forEach((child) => {
      tokens[child.id] = child;
    });

    this.props.onSelect(Object.values(tokens));
    this.setState({ tokens, expanded: false, value: '' });
  }

  onUngroupedClick = (obj) => {
    const tokens = this.state.tokens;
    tokens[obj.id] = obj;

    this.props.onSelect(Object.values(tokens));
    this.setState({ tokens, expanded: false, value: '' });
  }

  onTokenClick = (obj) => {
    const tokens = this.state.tokens;
    delete tokens[obj.id];

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
        if (addGroupTokens) {
          result[obj.id] = obj;
        }

        obj.children.forEach((child) => {
          result[child.id] = child;
        });
      } else {
        result[obj.id] = obj;
      }

      return result;
    }, {});

    this.props.onSelect(Object.values(tokens));
    this.setState({ tokens, expanded: false });
  }

  onClearAll = () => {
    this.props.onSelect(Object.values(this.state.tokens));
    this.setState({ tokens: {}, expanded: false });
  }

  onFocus = () => {
    this.setState({ expanded: true });
  }

  onBlur = () => {
    this.setState({ expanded: false });
  };

  render() {
    const itemIcon = this.props.itemIcon
      ? <img alt="Item" src={this.props.itemIcon} className={styles.itemIcon} />
      : null;

    const groupIcon = this.props.groupIcon
      ? <img alt="Group" src={this.props.groupIcon} className={styles.itemIcon} />
      : null;

    const items = this.state.data.reduce((acc, v) => {
      // Grouped
      if (v.children) {
        const children = v.children.reduce((result, vv) => {
          if (this.state.tokens[vv.id] !== undefined) {
            return result;
          }

          return result.concat(<button
            onClick={() => { this.onChildClick(vv); }}
            className={`${styles.item} ${styles.childItem}`}
            key={`item-${vv.id}`}
          >
            {itemIcon}
            {vv.text}
          </button>);
        }, []);

        if (this.props.addGroupTokens === false && children.length === 0) {
          return acc;
        }

        if (this.state.tokens[v.id] !== undefined) {
          return acc;
        }

        const group = (<button
          onClick={() => { this.onGroupClick(v); }}
          className={`${styles.item} ${styles.groupItem}`}
          key={`item-${v.id}`}
        >
          {groupIcon}
          {v.text}
        </button>);

        return acc.concat(group).concat(children);
      }

      // Ungrouped
      if (this.state.tokens[v.id] !== undefined) {
        return acc;
      }

      const ungrouped = (<button
        onClick={() => { this.onUngroupedClick(v); }}
        className={`${styles.item} ${styles.ungroupedItem}`}
        key={`item-${v.id}`}
      >
        {itemIcon}
        {v.text}
      </button>);

      return acc.concat(ungrouped);
    }, []);

    const selectall = (<div className={styles.controls}>
      <button
        className={styles.controlsButton}
        onClick={this.onSelectAll}
      >
         Select All
      </button>
      <div className={styles.controlsSpacer}>/</div>
      <button
        className={styles.controlsButton}
        onClick={this.onClearAll}
      >
        Clear All
      </button>
    </div>);

    const values = Object.values(this.state.tokens);
    const tokens = this.props.renderTokens
       ? this.props.renderTokens(values, this.onTokenClick)
       : values.map((val) => {
         return (<button
           key={`token-${val.id}`}
           onClick={() => { this.onTokenClick(val); }}
         >
           {val.text}
         </button>);
       });

    const nomatch = <div className={styles.nomatch}>{this.props.msgEmpty}</div>;

    const caret = (this.state.fetching || items.length === 0)
      ? null
      : (<button
        className={`fa fa-caret-down ${styles.caret}`}
        onClick={this.onCaretClick}
      />);

    const busy = this.state.fetching
      ? <span className={styles.busy} />
      : null;

    const maxResultsWarningIcon =
      (this.state.fetching || this.state.data.length < this.props.maxResults)
      ? null
      : <span className={`fa fa-exclamation-triangle ${styles.maxResults}`} />;

    const maxResultsWarningText =
      (this.state.fetching || items.length < this.props.maxResults)
      ? ''
      : 'This search is too general, so the results have been limited.';

    return (<div
      className={cx(styles.picker, this.props.className)}
      title={maxResultsWarningText}
    >
      {tokens}

      <div className={cx(styles.inputContainer)}>
        <input
          className={styles.input}
          type="text"
          placeholder={this.props.msgPlaceholder}
          value={this.state.value}
          onChange={this.onSearch}
        />
        {caret}
        {busy}
        {maxResultsWarningIcon}
      </div>

      <div className={styles.dropdownContainer}>
        <div
          className={cx(styles.dropdown, {
            [styles.expanded]: this.state.expanded })}
        >
          {items.length > 0 ? selectall : ''}
          {items.length ? items : nomatch}
        </div>
      </div>
    </div>);
  }
}
