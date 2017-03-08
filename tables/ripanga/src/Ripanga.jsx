import React, { PropTypes } from 'react';
import Range from 'react-range';

import RipangaHeadRow from './RipangaHeadRow';
import RipangaBodyRows from './RipangaBodyRows';
import RipangaStickyCells from './RipangaStickyCells';

import baseStyles from './Ripanga.scss';
import defaultStyles from './RipangaDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};
let isGrouped = false;

const i18n = {
  NO_RESULTS: 'No results found'
};

// TODO configurable columns
// TODO remove pane positioning
// TODO move sort saving from head cell to god class, remove global key
// TODO observable to resize: Cannot read property 'getBoundingClientRect' of undefined
// TODO finalize utils style stuff - getDefinitions(), groupingProps()
// TODO Strange thing if column definition name is not exactly correct ???  maybe RipangaHeadCell key={`head-${def.sortKey}-${i}`}
// TODO ben joseph's changes ???
// TODO throttle slider  ANDY
// TODO andy's single table solution + compose it
// TODO two tables, grouped/ungrouped
// TODO allow all checkboxes to clear - pass in initialState
// TODO URL update, controlled?

export default class Ripanga extends React.Component {
  static propTypes = {
    columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    globalKey: PropTypes.string.isRequired,
    idKey: PropTypes.string,
    panelPosition: PropTypes.oneOf(['left', 'right', 'none']),
    renderBodyRow: PropTypes.func,
    renderBodyStickyCell: PropTypes.func,
    renderEmpty: PropTypes.func,
    showCheckboxes: PropTypes.bool,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  static defaultProps = {
    idKey: 'id',
    panelPosition: 'right',
    renderBodyRow: null,
    renderBodyStickyCell: null,
    renderEmpty: null,
    showCheckboxes: false,
    stylesheets: [defaultStyles]
  }

  constructor(props) {
    super(props);

    this.scrollListener = null;
    this.resizeListener = null;

    window.addEventListener('scroll', this.scrollWindow);
    window.addEventListener('resize', this.resize);

    styles = composeStyles(baseStyles, props.stylesheets);

    isGrouped = (props.tableData.length > 0 && props.tableData[0].key !== undefined);

    const collapsedIds = props.tableData.reduce(
      (acc, v) => (v.key === undefined ? acc : Object.assign(acc, { [v.key.name]: false })), {});

    const checkedIds = props.tableData
      .reduce((tableAcc, group) => Object.assign(tableAcc, group.data
        .reduce((groupAcc, row) => Object.assign(groupAcc, { [row[props.idKey]]: false })
        , {}))
      , {});

    const allChecked = false;
    const allCollapsed = false;

    this.state = {
      allChecked,
      allCollapsed,
      checkedIds,
      collapsedIds,
      sliderValue: 0
    };
  }

  componentDidMount() {
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

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.tableData) !== JSON.stringify(nextProps.tableData)) {
      this.clearCollapsedGroups();
    }
  }

  componentDidUpdate() {
    if (this.props.tableData.length === 0) {
      return;
    }

    // this.bodyContainer
    //   .removeEventListener('scroll', this.scrollListener);
    // this.scrollListener =
    //   this.bodyContainer.addEventListener('scroll', this.scrollBody);

    this.resize();
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

  setHeadPosition = (value) => {
    this.stickyHead.style.position = value;
    this.headContainer.style.position = value;
  }

  trackSlider = () => {
    // dispatch(trackEvent('project_area.submittals.table_actions.horizontal_scroll'));
  }

  applyStaticBounds = (side) => {
    this.setHeadPosition('absolute');
    this.placePanelStatic(side);
  };

  applyStickyBounds = (side) => {
    this.setHeadPosition('fixed');
    this.placePanelSticky(side);
  };

  hideSticky = () => {
    this.stickyHead.style.display = 'none';
    this.stickyContainer.style.display = 'none';
  }

  placePanelStatic = (side) => {
    const {
      headContainer,
      stickyContainer,
      stickyHead,
      ripangaContainer
    } = this;

    const ripangaBounds = ripangaContainer.getBoundingClientRect();
    const stickyBounds = stickyContainer.getBoundingClientRect();

    switch (side) {
      case 'right':
        stickyHead.style.left = `${ripangaBounds.width - stickyBounds.width}px`;
        stickyContainer.style.right = 0;
        headContainer.style.left = 0;
        break;
      case 'left':
        stickyHead.style.left = 0;
        stickyContainer.style.left = 0;
        headContainer.style.left = `${stickyBounds.width}px`;
        break;
      case 'none':
        this.hideSticky();
        this.headContainer.style.left = 0;
        break;
      default:
        console.error(`placePanelStatic does not accept side: ${side}`);
    }
  };

  placePanelSticky = (side) => {
    const {
      headContainer,
      stickyContainer,
      stickyHead,
      ripangaContainer
    } = this;

    const ripangaBounds = ripangaContainer.getBoundingClientRect();
    const stickyBounds = stickyContainer.getBoundingClientRect();

    switch (side) {
      case 'right':
        stickyHead.style.left = `${ripangaBounds.right - stickyBounds.width}px`;
        headContainer.style.left = `${ripangaBounds.left}px`;
        stickyContainer.style.right = 0;
        break;
      case 'left':
        stickyHead.style.left = `${ripangaBounds.left}px`;
        headContainer.style.left =
          `${ripangaBounds.left + stickyBounds.width}px`;
        stickyContainer.style.left = 0;
        break;
      case 'none':
        this.hideSticky();
        headContainer.style.left = `${ripangaBounds.left}px`;
        break;
      default:
        console.error(`placePanelSticky does not accept side: ${side}`);
    }
  };

  // TODO: Throttle window resize and scroll
  recalculateSticky = () => {
    if (this.stickyHeaderActive()) {
      this.applyStickyBounds(this.props.panelPosition);
    } else {
      this.applyStaticBounds(this.props.panelPosition);
    }
  }

  storeCheckedStates = () => {
    sessionStorage.setItem(`${this.props.globalKey}/CHECKED`, JSON.stringify(this.state.checkedIds));
  };

  resize = () => {
    // this.resizeRipanga();
    // this.resizeHead();
    // this.resizeSticky();
  }

  resizeHead = () => {
    const {
      bodyContainer,
      bodyTable,
      headContainer,
      headTable
    } = this;

    if (bodyTable.rows.length > 0) {
      const headcells = headTable.rows[0].cells;

      const renderedRow = Array.from(bodyTable.rows)
        .find(row => row.cells.length === headcells.length);

      if (renderedRow !== undefined) {
        ([...renderedRow.cells]).forEach((cell, index) => {
          headTable.rows[0].cells[index].style.width =
            `${cell.getBoundingClientRect().width}px`;
        });
      }
    }

    headContainer.style.width =
      `${bodyContainer.getBoundingClientRect().width}px`;

    this.recalculateSticky();
  }

  resizeRipanga = () => {
    const {
      headContainer,
      stickyContainer,
      ripangaContainer
    } = this;

    const { panelPosition } = this.props;

    const headBounds = headContainer.getBoundingClientRect();
    const stickyBounds = stickyContainer.getBoundingClientRect();

    const setTableContainerPadding = (side) => {
      ripangaContainer.style.paddingTop = `${headBounds.height}px`;
      switch (side) {
        case 'right':
          ripangaContainer.style.paddingRight = `${stickyBounds.width}px`;
          break;
        case 'left':
          ripangaContainer.style.paddingLeft = `${stickyBounds.width}px`;
          break;
        case 'none':
          ripangaContainer.style.paddingLeft = 0;
          break;
        default:
          console.error(`setTableContainerPadding does not accept side: ${side}`);
      }
    };

    setTableContainerPadding(panelPosition);
  }

  resizeSticky = () => {
    const {
      bodyContainer,
      bodyTable,
      headContainer,
      slider,
      stickyContainer,
      stickyHead
    } = this;

    const { panelPosition } = this.props;

    const headBounds = headContainer.getBoundingClientRect();

    if (bodyContainer.clientWidth >= bodyContainer.scrollWidth) {
      slider.range.style.display = 'none';
    } else {
      slider.range.style.display = 'inline';
    }

    if (panelPosition !== 'none') {
      stickyHead.style.height = `${headBounds.height}px`;
      stickyHead.style.width =
        `${stickyContainer.getBoundingClientRect().width}px`;
    }

    this.recalculateSticky();

    stickyContainer.style.paddingTop = `${headBounds.height}px`;

    const stickyCells = stickyContainer.childNodes;

    Array.from(stickyCells).forEach((node, index) => {
      node.style.height =
        `${bodyTable.rows[index].getBoundingClientRect().height}px`;
    });
  }

  scrollSlider = (e) => {
    const {
      bodyContainer
    } = this;

    const v = e.target.value;
    const scrollWidth = bodyContainer.scrollWidth - bodyContainer.offsetWidth;
    const delta = e.target.getAttribute('max') - e.target.getAttribute('min');

    this.setState({ sliderValue: parseInt(v, 0) });

    bodyContainer.scrollLeft = (scrollWidth * v) / delta;
  }

  scrollBody = () => {
    const {
      bodyContainer,
      headContainer,
      slider,
      stickyContainer
    } = this;

    headContainer.scrollLeft = bodyContainer.scrollLeft;
    stickyContainer.scrollTop = bodyContainer.scrollTop;

    const delta = slider.props.max - slider.props.min;
    const scrollWidth = bodyContainer.scrollWidth - bodyContainer.offsetWidth;
    const sliderValue = (bodyContainer.scrollLeft * delta) / scrollWidth;

    this.setState({ sliderValue });
  }

  scrollWindow = () => {
    if (this.ripangaContainer === undefined) {
      return;
    }

    this.recalculateSticky();
  }

  stickyHeaderActive = () => {
    const ripangaBounds = this.ripangaContainer.getBoundingClientRect();
    return ripangaBounds.top < 0;
  }

  render() {
    const {
      columnDefinitions,
      globalKey,
      idKey,
      renderBodyRow,
      renderBodyStickyCell,
      renderEmpty,
      showCheckboxes,
      tableData
    } = this.props;

    const {
      allChecked,
      allCollapsed,
      checkedIds,
      collapsedIds,
      sliderValue
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
      <div className={styles.container} ref={(el) => { this.ripangaContainer = el; }}>
        <div className={styles.headContainer} ref={(el) => { this.headContainer = el; }}>
          <table className={styles.head} ref={(el) => { this.headTable = el; }}>
            { RipangaHeadRow({
              allChecked,
              allCollapsed,
              columnDefinitions,
              globalKey,
              idKey,
              isGrouped,
              onCheckAll: this.onCheckAll,
              onCollapseAll: this.onCollapseAll,
              showCheckboxes,
              styles
            }) }
          </table>
        </div>

        <div className={styles.bodyContainer} ref={(el) => { this.bodyContainer = el; }}>
          <table className={styles.body} ref={(el) => { this.bodyTable = el; }}>
            { RipangaBodyRows({
              checkedIds,
              collapsedIds,
              columnDefinitions,
              idKey,
              isGrouped,
              onRowCheck: this.onRowCheck,
              onCollapse: this.onCollapse,
              onGroupCheck: this.onGroupCheck,
              renderBodyRow,
              showCheckboxes,
              styles,
              tableData
            }) }
          </table>
        </div>

        <div className={styles.stickyContainer} ref={(el) => { this.stickyContainer = el; }}>
          { RipangaStickyCells({
            collapsedIds,
            idKey,
            renderBodyStickyCell,
            styles,
            tableData
          }) }
        </div>

        <div className={styles.stickyCellHead} ref={(el) => { this.stickyHead = el; }}>
          <Range
            className={styles.horizontalScroller}
            max='50'
            min='0'
            onChange={this.scrollSlider}
            onClick={this.trackSlider}
            ref={(el) => { this.slider = el; }}
            type='range'
            value={sliderValue}
          />
        </div>
      </div>
    );
  }
}
