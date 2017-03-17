import React, { PropTypes } from 'react';

import RipangaHeadRow from './RipangaHeadRow';
import RipangaBodyRows from './RipangaBodyRows';

import baseStyles from './Ripanga.scss';
import defaultStyles from './RipangaDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};
let showGroups = false;
let showSticky = false;

let headerTop = 0;
let sidebarLeft = 0;
let sidebarCells = [];

const i18n = {
  NO_RESULTS: 'No results found'
};

const moveHeader = (el, y) => {
  window.requestAnimationFrame(() => {
    el.style.transform = `translate3d(0, ${y}px, 0)`;  // eslint-disable-line no-param-reassign
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
      el.style.transform = `translate3d(${x}px, 0, 0)`;  // eslint-disable-line no-param-reassign
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

// TODO throttle slider
// TODO allow all checkboxes to clear - pass in initialState
// TODO URL manager, storage manager

// cells.push(<td className={styles.sticky} key='head-sticky'>
//   {RipangaSlider({ onScroll, onScrollTrack, styles, value: scrollerValue })}
// </td>);

export default class Ripanga extends React.Component {
  static propTypes = {
    columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    globalKey: PropTypes.string.isRequired,
    idKey: PropTypes.string,
    renderBodyStickyCell: PropTypes.func,
    renderHeadStickyCell: PropTypes.func,
    renderGroupStickyCell: PropTypes.func,
    renderEmpty: PropTypes.func,
    showCheckboxes: PropTypes.bool,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  static defaultProps = {
    idKey: 'id',
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

    window.addEventListener('scroll', this.onScrollWindow);
    window.addEventListener('resize', this.onResize);

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
    sidebarCells = document.querySelectorAll(`.${styles.stickyCell}`);
    this.onResize();
    this.onScrollWindow();


    // TODO storage / url persistence
    // const {
    //   globalKey
    // } = this.props;
    //
    // const storedRecords = localStorage.getItem(`${globalKey}/CHECKED`);
    // const obj = (storedRecords ? JSON.parse(storedRecords) : {});
    // const ids = [];
    //
    // for (let i in obj) {
    //   ids.push(parseInt(i, 10));
    // }
    //
    // this.setChecked(ids, globalKey);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (JSON.stringify(this.props.tableData) !== JSON.stringify(nextProps.tableData)) {
  //     this.clearCollapsedGroups();
  //   }
  // }

  onScrollWindow = () => {
    const diffX = window.scrollX - sidebarLeft;
    const diffY = window.scrollY - headerTop;

    if (diffY > 0) {
      moveHeader(this.table.tHead, diffY);
    } else {
      restoreHeader(this.table.tHead);
    }

    if (diffX < 0) {
      moveSidebar(sidebarCells, diffX);
    } else {
      restoreSidebar(sidebarCells);
    }
  }

  onResize = () => {
    headerTop = this.table.tHead.getBoundingClientRect().top

    sidebarLeft = this.table.getBoundingClientRect().right
                - document.body.getBoundingClientRect().width;

    this.onScrollWindow();
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

  onSort = () => {
    // const attribute = def.sortKey;
    // const direction = (params.sort.attribute === attribute
    //   && params.sort.direction === DIRECTION.ASC
    //   ? DIRECTION.DESC
    //   : DIRECTION.ASC);
    //
    // params.sort = { attribute, direction };
    // params.page = 1;
    //
    // sessionStorage.setItem(`${globalKey}/SORT`, JSON.stringify(params.sort));
    //
    // history.pushState(
    //   history.state,
    //   '',
    //   `${url[0]}?${qs.stringify(params, { arrayFormat: 'brackets' })}`,
    // );
  }

  onScroll = (evt) => {
    // const { value } = evt.target.value;
    // const steps = (this.props.scrollParent.scrollWidth - this.props.scrollParent.offsetWidth) / 50;
    //
    // parent.scrollLeft = steps * value;
  }

  onScrollTrack = () => {
    console.warn("Tracking scroller")
    // dispatch(trackEvent('project_area.submittals.table_actions.horizontal_scroll'));
  }

  // storeCheckedStates = () => {
  //   sessionStorage.setItem(`${this.props.globalKey}/CHECKED`, JSON.stringify(this.state.checkedIds));
  // };

  // scrollSlider = (e) => {
  //   const {
  //     bodyContainer
  //   } = this;
  //
  //   const v = e.target.value;
  //   const scrollWidth = bodyContainer.scrollWidth - bodyContainer.offsetWidth;
  //   const delta = e.target.getAttribute('max') - e.target.getAttribute('min');
  //
  //   this.setState({ scrollerValue: parseInt(v, 0) });
  //
  //   bodyContainer.scrollLeft = (scrollWidth * v) / delta;
  // }
  //
  // scrollBody = () => {
  //   const {
  //     bodyContainer,
  //     headContainer,
  //     slider,
  //     stickyContainer
  //   } = this;
  //
  //   headContainer.scrollLeft = bodyContainer.scrollLeft;
  //   stickyContainer.scrollTop = bodyContainer.scrollTop;
  //
  //   const delta = slider.props.max - slider.props.min;
  //   const scrollWidth = bodyContainer.scrollWidth - bodyContainer.offsetWidth;
  //   const scrollerValue = (bodyContainer.scrollLeft * delta) / scrollWidth;
  //
  //   this.setState({ scrollerValue });
  // }
  //
  // scrollWindow = () => {
  //   if (this.ripangaContainer === undefined) {
  //     return;
  //   }
  //
  //   this.recalculateSticky();
  // }
  //
  // stickyHeaderActive = () => {
  //   const ripangaBounds = this.ripangaContainer.getBoundingClientRect();
  //   return ripangaBounds.top < 0;
  // }

  render() {
    const {
      columnDefinitions,
      idKey,
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
