import React, { PropTypes } from 'react';

import RipangaHeadRow from './RipangaHeadRow';
import RipangaBodyRows from './RipangaBodyRows';
import RipangaSidebar from './RipangaSidebar';

import baseStyles from './Ripanga.scss';
import defaultStyles from './RipangaDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};
let showGroups = false;

let headerInitialTop = 0;

let debouncedResize = null;

const i18n = {
  NO_RESULTS: 'No results found'
};

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
    onSort: PropTypes.func,
    showCheckboxes: PropTypes.bool,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  static defaultProps = {
    idKey: 'id',
    onSort: null,
    renderEmpty: null,
    renderGroupTitle: null,
    renderSidebarBodyCell: null,
    renderSidebarHeadCell: null,
    renderSidebarGroupCell: null,
    showCheckboxes: false,
    stylesheets: []
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);
    showGroups = (props.tableData.length > 0 && props.tableData[0].key !== undefined);
    debouncedResize = debounce(this.onResize, 100);

    const collapsedIds = props.tableData.reduce(
      (acc, v) => (v.key === undefined ? acc : Object.assign(acc, { [v.key.key]: false })), {});

    const checkedIds = props.tableData
      .reduce((tableAcc, group) => Object.assign(tableAcc, group.data
        .reduce((groupAcc, row) => Object.assign(groupAcc, { [row[props.idKey]]: false })
        , {}))
      , {});

    this.state = {
      allChecked: false,
      allCollapsed: false,
      checkedIds,
      collapsedIds
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('uncheck', this.onExternalUncheckAll);

    this.onResize();
  }

  componentDidUpdate() {
    if (!this.table) {
      return;
    }

    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', debouncedResize);
    window.removeEventListener('uncheck', this.onExternalUncheckAll);

    this.table.removeChild(overflowTetherContainer);
  }

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
    const initialWidth = (showGroups || this.props.showCheckboxes) ? 60 : 0;
    const tableWidth = this.props.columnDefinitions
      .reduce((acc, def) => def.hidden ? acc : acc + def.width, initialWidth);

    this.header.style.minWidth = `${tableWidth}px`;

    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    headerInitialTop = this.header.getBoundingClientRect().top + scrollTop;

    this.onScroll();
  }

  onSort = () => {
    if (this.props.onSort) {
      this.props.onSort();
    }
  }

  onCollapse = (id) => {
    const { collapsedIds } = this.state;

    collapsedIds[id] = !collapsedIds[id];

    const allCollapsed = Object.values(collapsedIds).reduce((acc, v) => acc && v, true);

    this.setState({ collapsedIds, allCollapsed });
  }

  onCollapseAll = () => {
    const keys = Object.keys(this.state.collapsedIds);
    const allCollapsed = !this.state.allCollapsed;

    const collapsedIds = keys.reduce((acc, k) => Object.assign(acc, { [k]: allCollapsed }), {});

    this.setState({ allCollapsed, collapsedIds });
  }

  onRowCheck = (id) => {
    const { checkedIds } = this.state;
    checkedIds[id] = !checkedIds[id];

    const allChecked = Object.values(checkedIds).reduce((acc, v) => acc && v, true);

    this.setState({ allChecked, checkedIds });
  }

  onGroupCheck = (groupId) => {
    const groupIds = this.props.tableData.find(d => d.key.name === groupId)
      .data
      .reduce((acc, row) => acc.concat(row[this.props.idKey]), []);

    const { checkedIds } = this.state;
    const groupIsChecked = groupIds.reduce((acc, id) => acc && checkedIds[id], true);
    groupIds.forEach((id) => { checkedIds[id] = !groupIsChecked; });

    const allChecked = Object.values(checkedIds).reduce((acc, v) => acc && v, true);

    this.setState({ allChecked, checkedIds });
  }

  onCheckAll = () => {
    const allChecked = !this.state.allChecked;
    const checkedIds = Object.keys(this.state.checkedIds)
      .reduce((acc, k) => Object.assign(acc, { [k]: allChecked }), {});

    this.setState({ allChecked, checkedIds });
  }

  onExternalUncheckAll = () => {
    const checkedIds = Object.keys(this.state.checkedIds)
      .reduce((acc, k) => Object.assign(acc, { [k]: false }), {});

    this.setState({ allChecked: false, checkedIds });
  }

  render() {
    const {
      columnDefinitions,
      idKey,
      renderCell,
      renderEmpty,
      renderGroupTitle,
      renderSidebarBodyCell,
      renderSidebarHeadCell,
      renderSidebarGroupCell,
      showCheckboxes,
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
              onSort: this.onSort,
              showGroups,
              showCheckboxes,
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
