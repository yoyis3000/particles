import React, { PropTypes } from 'react';

import RipangaHeadRow from './RipangaHeadRow';
import RipangaBodyRows from './RipangaBodyRows';

import baseStyles from './Ripanga.scss';
import defaultStyles from './RipangaDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};
let showGroups = false;
let showSticky = false;

let headerInitial = 0;
let sidebarInitial = 0;
let sidebarCells = [];
let hScrollParent;

const i18n = {
  NO_RESULTS: 'No results found'
};

const moveHeader = (el, y) => {
  window.requestAnimationFrame(() => {
    el.style.transform = `translate3d(0, ${y}px, 1px)`;  // eslint-disable-line no-param-reassign
  });
};

const restoreHeader = (el) => {
  window.requestAnimationFrame(() => {
    el.style.transform = ''; // eslint-disable-line no-param-reassign
  });
};

const moveSidebar = (els, x) => {
  els.forEach((el) => {
    window.requestAnimationFrame(() => {
      el.style.transform = `translate3d(${x}px, 0, 1px)`;  // eslint-disable-line no-param-reassign
    });
  });
};

const restoreSidebar = (els) => {
  els.forEach((el) => {
    window.requestAnimationFrame(() => {
      el.style.transform = '';  // eslint-disable-line no-param-reassign
    });
  });
};

export default class Ripanga extends React.Component {
  static propTypes = {
    columnDefinitions: PropTypes.arrayOf(PropTypes.object).isRequired,
    idKey: PropTypes.string,
    renderBodyCell: PropTypes.func.isRequired,
    renderBodyRow: PropTypes.func,
    renderBodyStickyCell: PropTypes.func,
    renderHeadStickyCell: PropTypes.func,
    renderGroupStickyCell: PropTypes.func,
    renderEmpty: PropTypes.func,
    onSort: PropTypes.func,
    showCheckboxes: PropTypes.bool,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  static defaultProps = {
    idKey: 'id',
    onSort: null,
    renderBodyRow: null,
    renderBodyStickyCell: null,
    renderHeadStickyCell: null,
    renderGroupStickyCell: null,
    renderEmpty: null,
    showCheckboxes: false,
    stylesheets: []
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);
    showGroups = (props.tableData.length > 0 && props.tableData[0].key !== undefined);
    showSticky = (props.renderHeadStickyCell !== null
      || props.renderGroupStickyCell !== null
      || props.renderBodyStickyCell !== null);

    const collapsedIds = props.tableData.reduce(
      (acc, v) => (v.key === undefined ? acc : Object.assign(acc, { [v.key.name]: false })), {});

    const checkedIds = props.tableData
      .reduce((tableAcc, group) => Object.assign(tableAcc, group.data
        .reduce((groupAcc, row) => Object.assign(groupAcc, { [row[props.idKey]]: false })
        , {}))
      , {});

    this.state = {
      allChecked: false,
      allCollapsed: false,
      checkedIds,
      collapsedIds,
      scrollerValue: 0
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onVScroll);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('uncheck', this.onExternalUncheckAll);
  }

  componentDidUpdate() {
    if (this.table === undefined) {
      return;
    }

    sidebarCells = document.querySelectorAll(`.${styles.stickyCell.split(' ').join('.')}`);

    this.onResize();
    this.onHScroll();
    this.onVScroll();
  }

  onHScroll = () => {
    // TODO initial state

    if (sidebarInitial < 0) {
      moveSidebar(sidebarCells, hScrollParent.scrollLeft + sidebarInitial);
    } else {
      restoreSidebar(sidebarCells);
    }
  }

  onVScroll = () => {
    // TODO can't hover on upper rows

    if (!this.table) {
      return;
    }

    if (document.body.scrollTop > headerInitial) {
      moveHeader(this.table.tHead, document.body.scrollTop - headerInitial);
    } else {
      restoreHeader(this.table.tHead);
    }
  }

  onResize = () => {
    hScrollParent = this.table;

    while (hScrollParent !== document.body && hScrollParent.scrollWidth <= hScrollParent.clientWidth) {
      hScrollParent = hScrollParent.parentNode;
    }

    hScrollParent.removeEventListener('scroll', this.onHScroll);
    hScrollParent.addEventListener('scroll', this.onHScroll);

    headerInitial = this.table.getBoundingClientRect().top + document.body.scrollTop;

    console.warn( hScrollParent.scrollLeft)
    sidebarInitial = hScrollParent.getBoundingClientRect().right - sidebarCells[0].getBoundingClientRect().right;
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
      renderBodyCell,
      renderBodyRow,
      renderBodyStickyCell,
      renderHeadStickyCell,
      renderGroupStickyCell,
      renderEmpty,
      showCheckboxes,
      tableData
    } = this.props;

    const {
      allChecked,
      allCollapsed,
      checkedIds,
      collapsedIds,
      scrollerValue
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

    return (
      <div className={styles.container}>
        <table className={styles.table} ref={(el) => { this.table = el; }}>
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
            renderHeadStickyCell,
            scrollerValue,
            showGroups,
            showCheckboxes,
            showSticky,
            styles
          }) }

          { RipangaBodyRows({
            checkedIds,
            collapsedIds,
            columnDefinitions,
            idKey,
            onRowCheck: this.onRowCheck,
            onCollapse: this.onCollapse,
            onGroupCheck: this.onGroupCheck,
            renderBodyCell,
            renderBodyRow,
            renderBodyStickyCell,
            renderGroupStickyCell,
            showGroups,
            showCheckboxes,
            showSticky,
            styles,
            tableData
          }) }
        </table>
      </div>
    );
  }
}
