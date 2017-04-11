import React, { PropTypes } from 'react';

import RipangaHeadRow from './RipangaHeadRow';
import RipangaBodyRows from './RipangaBodyRows';
import RipangaSidebar from './RipangaSidebar';

import baseStyles from './Ripanga.scss';
import defaultStyles from './RipangaDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};
let showGroups = false;
let showSidebar = false;

let hScrollParent = null;
let headerInitialTop = {};
let sidebarIsOffset = 0;

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

const moveSidebar = (els, x) => {
  Array.prototype.forEach.call(els, (el) => {
    window.requestAnimationFrame(() => {
      el.style.right = `${x}px`;  // eslint-disable-line no-param-reassign
    });
  });
};

const restoreSidebar = (els) => {
  els.forEach((el) => {
    window.requestAnimationFrame(() => {
      el.style.right = 0;  // eslint-disable-line no-param-reassign
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
    showSidebar = (props.renderHeadStickyCell !== null
      || props.renderGroupStickyCell !== null
      || props.renderBodyStickyCell !== null);

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
      collapsedIds,
      scrollerValue: 0
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onVScroll);
    window.addEventListener('resize', debounce(this.onResize, 100));
    window.addEventListener('uncheck', this.onExternalUncheckAll);

    this.onResize();
  }

  componentDidUpdate() {
    if (!this.container) {
      return;
    }

    this.container.addEventListener('scroll', this.onHScroll);
    this.onResize();
  }

  onHScroll = () => {
    if (sidebarIsOffset) {
      // moveSidebar(sidebarCells, -1 * this.container.scrollLeft);
    } else {
      // restoreSidebar(sidebarCells);
    }
  }

  onVScroll = () => {
    if (!this.container) {
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
    if (!this.container) {
      return;
    }

    const sidebarCells = document.querySelectorAll(`.${styles.sidebarCell.split(' ').shift()}`);
    const controlCells = document.querySelectorAll(`.${styles.controlCell.split(' ').shift()}`);

    controlCells.forEach((cell, i) => {
      sidebarCells[i].style.height = `${cell.offsetHeight}px`;
    });

    hScrollParent = this.container;

    while (hScrollParent !== document.body
      && hScrollParent.scrollWidth <= hScrollParent.clientWidth) {
      hScrollParent = hScrollParent.parentNode;
    }

    hScrollParent.removeEventListener('scroll', this.onHScroll);
    hScrollParent.addEventListener('scroll', this.onHScroll);

    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    headerInitialTop = this.container.getBoundingClientRect().top + scrollTop;
    sidebarIsOffset = (this.container.scrollWidth - this.container.offsetWidth) > 0;

    this.onHScroll();
    this.onVScroll();
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

    // if (renderBodyRow) {
    //   return renderBodyRow(rowData, cells);
    // }

    // TODO
    // Animate group collapse
    // Animate column collapse
    // render body row
    // few columns causes bad sidebar offset
    // list select instead of dropdown
    // scroller initial value

    return (
      <div className={styles.container} ref={(el) => { this.container = el; }}>
        <div className={styles.table}>
          <div className={styles.headRow} ref={(el) => { this.header = el; }}>
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
              showSidebar,
              styles
            }) }
          </div>

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
            showGroups,
            showCheckboxes,
            showSidebar,
            styles,
            tableData
          }) }
        </div>

        <div className={styles.sidebar}>
          { showSidebar
            ? RipangaSidebar({
              idKey,
              renderBodyStickyCell,
              renderGroupStickyCell,
              renderHeadStickyCell,
              showGroups,
              styles,
              tableData
            })
            : null }
        </div>
      </div>
    );
  }
}
