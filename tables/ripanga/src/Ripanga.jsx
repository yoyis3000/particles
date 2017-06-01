import React, { PropTypes } from 'react';

import RipangaHeadRow from './RipangaHeadRow';
import RipangaBodyRows from './RipangaBodyRows';
import RipangaSidebar from './RipangaSidebar';

import baseStyles from './Ripanga.scss';
import defaultStyles from './RipangaDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

const SORT_DIRECTION = { ASC: 'asc', DESC: 'desc', NONE: 'none' };

let styles = {};
let showGroups = false;

let headerInitialTop = 0;

let debouncedResize = null;

const i18n = {
  NO_RESULTS: 'No results found'
};

const checkedReducer = ids =>
  Object.keys(ids).reduce((acc, key) => {
    if (key !== 0 && ids[key]) {
      acc.push(key);
    }

    return acc;
  }, []);

const debounce = (fn, ms) => {
  let timer = null;

  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
};

const moveHeader = (el, y) => {
  window.requestAnimationFrame(() => {
    el.style.top = `${y}px`; // eslint-disable-line no-param-reassign
  });
};

const restoreHeader = (el) => {
  window.requestAnimationFrame(() => {
    el.style.top = 0; // eslint-disable-line no-param-reassign
  });
};

export { SORT_DIRECTION };

export default class Ripanga extends React.Component {
  static propTypes = {
    columnDefinitions: PropTypes.arrayOf(PropTypes.object).isRequired,
    idKey: PropTypes.string,
    renderCell: PropTypes.func.isRequired,
    renderEmpty: PropTypes.func,
    renderGroupTitle: PropTypes.func,
    renderSidebarBodyCell: PropTypes.func,
    renderSidebarHeadCell: PropTypes.func,
    renderSidebarGroupCell: PropTypes.func,
    onCheck: PropTypes.func,
    onSort: PropTypes.func,
    scope: PropTypes.string.isRequired,
    showCheckboxes: PropTypes.bool,
    sortState: PropTypes.shape(),
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  static defaultProps = {
    idKey: 'id',
    onCheck: ids => console.info('No onCheck passed to Ripanga. Current checked state: ', ids), // eslint-disable-line
    onSort: null,
    renderEmpty: null,
    renderGroupTitle: null,
    renderSidebarBodyCell: null,
    renderSidebarHeadCell: null,
    renderSidebarGroupCell: null,
    showCheckboxes: false,
    sortState: { direction: SORT_DIRECTION.NONE, attribute: null },
    stylesheets: []
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);
    showGroups = (props.tableData.length > 0 && props.tableData[0].key !== undefined);
    debouncedResize = debounce(this.onResize, 100);

    this.state = {
      allChecked: false,
      allCollapsed: false,
      checkedIds: JSON.parse(sessionStorage.getItem(`${props.scope}/CHECKED`)) || {},
      collapsedIds: JSON.parse(sessionStorage.getItem(`${props.scope}/COLLAPSED`)) || {}
    };
  }

  componentDidMount() {
    window.addEventListener('table/checkAll', this.onCheckAll);
    window.addEventListener('table/checkOne', ({ detail: id }) => this.onRowCheck(id));
    window.addEventListener('table/resize', debouncedResize);
    window.addEventListener('table/scroll', this.onScroll);

    this.onResize();
  }

  componentDidUpdate() {
    if (!this.table) {
      return;
    }

    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('table/checkAll', this.onCheckAll);
    window.removeEventListener('table/checkOne', id => this.onRowCheck(id));
    window.removeEventListener('table/resize', debouncedResize);
    window.removeEventListener('table/scroll', this.onScroll);
  }

  onCheck = ids => this.props.onCheck(checkedReducer(ids));

  onScroll = () => {
    if (!this.table) {
      return;
    }

    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    if (scrollTop > headerInitialTop) {
      moveHeader(this.header, scrollTop - headerInitialTop);
    } else {
      restoreHeader(this.header);
    }
  }

  onResize = () => {
    if (!this.table) {
      return;
    }

    // Having each cell move individually is good for inheriting sizes but bad for perf. Ben 170411
    const sidebarCells = document.querySelectorAll(`.${styles.sidebarCell.split(' ').shift()}`);
    const tableRows = document.querySelectorAll(`.${styles.tableRow.split(' ').shift()}`);
    const len = tableRows.length;

    for (let i = 0; i < len; i += 1) {
      sidebarCells[i].style.height = `${tableRows[i].offsetHeight}px`;
    }

    // Required for <div> elements to maintain background color for full scroll width. Ben 170411
    let initialWidth = 0;

    if (showGroups) {
      initialWidth += 30;
    }

    if (this.props.showCheckboxes) {
      initialWidth += 30;
    }

    const tableWidth = this.props.columnDefinitions
      .reduce((acc, def) => (def.hidden ? acc : acc + def.width), initialWidth);

    this.header.style.minWidth = `${tableWidth}px`;

    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    headerInitialTop = this.header.getBoundingClientRect().top + scrollTop;

    this.onScroll();
  }

  onCollapse = (id) => {
    const { collapsedIds } = this.state;

    collapsedIds[id] = !collapsedIds[id];

    const allCollapsed = Object.values(collapsedIds).reduce((acc, v) => acc && v, true);

    this.setState({ collapsedIds, allCollapsed }, this.updateStorage);
  }

  onCollapseAll = () => {
    const keys = Object.keys(this.state.collapsedIds);
    const allCollapsed = !this.state.allCollapsed;

    const collapsedIds = keys.reduce((acc, k) => Object.assign(acc, { [k]: allCollapsed }), {});

    this.setState({ allCollapsed, collapsedIds }, this.updateStorage);
  }

  onRowCheck = (id) => {
    const { checkedIds } = this.state;

    if (id) {
      checkedIds[id] = !checkedIds[id];
    }

    this.onCheck(checkedIds);
    const allChecked = Object.values(checkedIds).reduce((acc, v) => acc && v, true);

    this.setState({ allChecked, checkedIds }, this.updateStorage);
  }

  onGroupCheck = (groupId) => {
    const groupIds = this.props.tableData.find(d => d.key.name === groupId)
      .data
      .reduce((acc, row) => acc.concat(row[this.props.idKey]), []);

    const { checkedIds } = this.state;
    const groupIsChecked = groupIds.reduce((acc, id) => acc && checkedIds[id], true);
    groupIds.forEach((id) => { checkedIds[id] = !groupIsChecked; });

    this.onCheck(checkedIds);
    const allChecked = Object.values(checkedIds).reduce((acc, v) => acc && v, true);

    this.setState({ allChecked, checkedIds }, this.updateStorage);
  }

  onCheckAll = () => {
    const allChecked = !this.state.allChecked;

    const checkedIds =
      this.props.tableData[0].data
        .reduce((acc, item) => Object.assign(acc, { [item.id]: allChecked }), {});

    this.onCheck(checkedIds);

    this.setState({ allChecked, checkedIds }, this.updateStorage);
  }

  updateStorage = () => {
    const { checkedIds, collapsedIds } = this.state;

    sessionStorage.setItem(`${this.props.scope}/CHECKED`, JSON.stringify(checkedIds));
    sessionStorage.setItem(`${this.props.scope}/COLLAPSED`, JSON.stringify(collapsedIds));
  }

  render() {
    const {
      columnDefinitions,
      idKey,
      onSort,
      renderCell,
      renderEmpty,
      renderGroupTitle,
      renderSidebarBodyCell,
      renderSidebarHeadCell,
      renderSidebarGroupCell,
      showCheckboxes,
      sortState,
      tableData
    } = this.props;

    const {
      allChecked,
      allCollapsed,
      checkedIds,
      collapsedIds
    } = this.state;

    if (tableData.length === 0) {
      if (renderEmpty) {
        return renderEmpty();
      }

      return (
        <h3 className='no-borders padding-top empty_table empty_graphic'>
          <img
            alt='Empty Table'
            src='/assets/no_results_illustration.svg'
            className='text-align-center empty_table_graphic'
          />
          <span className='empty_table_label'>{i18n.NO_RESULTS}</span>
        </h3>
      );
    }

    return (<div className={styles.contentContainer}>
      <RipangaSidebar
        {
          ...{
            idKey,
            renderSidebarBodyCell,
            renderSidebarHeadCell,
            renderSidebarGroupCell,
            showGroups,
            styles,
            tableData
          }
        }
      />
      <div className={styles.tableContainer} ref={(el) => { this.tableContainer = el; }}>
        <div className={styles.table} ref={(el) => { this.table = el; }}>
          <div className={styles.tableHead} ref={(el) => { this.header = el; }}>
            { RipangaHeadRow({
              allChecked,
              allCollapsed,
              columnDefinitions,
              idKey,
              onCheckAll: this.onCheckAll,
              onCollapseAll: this.onCollapseAll,
              onScroll: this.onScroll,
              onScrollTrack: this.onScrollTrack,
              onSort,
              showGroups,
              showCheckboxes,
              sortState,
              styles
            }) }
          </div>
          <div className={styles.tableBody}>
            { RipangaBodyRows({
              checkedIds,
              collapsedIds,
              columnDefinitions,
              idKey,
              onRowCheck: this.onRowCheck,
              onCollapse: this.onCollapse,
              onGroupCheck: this.onGroupCheck,
              renderCell,
              renderGroupTitle,
              showGroups,
              showCheckboxes,
              styles,
              tableData
            }) }
          </div>
        </div>
      </div>
    </div>);
  }
}
