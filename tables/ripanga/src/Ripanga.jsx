import React, { PropTypes } from 'react';
import Range from 'react-range';

import RipangaHeadRow from './RipangaHeadRow';
import RipangaBodyRows from './RipangaBodyRows';
import RipangaStickyCells from './RipangaStickyCells';

import baseStyles from './Ripanga.scss';
import defaultStyles from './RipangaDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};
let showGroups = false;
let headerTop = 0;
let headerIsFixed = false;
let renderingAnimationFrame = false;

const i18n = {
  NO_RESULTS: 'No results found'
};

const moveHeader = (el, y) => {
  if (!renderingAnimationFrame) {
    renderingAnimationFrame = true;
    window.requestAnimationFrame(() => {
      el.style.transform = `translate3d(0, ${y}px, 1px)`;  // eslint-disable-line no-param-reassign
      renderingAnimationFrame = false;
    });
  }
};


export default class Ripanga extends React.Component {
  static propTypes = {
    columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    globalKey: PropTypes.string.isRequired,
    idKey: PropTypes.string,
    renderBodyRow: PropTypes.func,
    renderBodyStickyCell: PropTypes.func,
    renderEmpty: PropTypes.func,
    showCheckboxes: PropTypes.bool,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  static defaultProps = {
    idKey: 'id',
    renderBodyRow: null,
    renderBodyStickyCell: null,
    renderEmpty: null,
    showCheckboxes: false,
    stylesheets: [defaultStyles]
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, props.stylesheets);
    showGroups = (props.tableData.length > 0 && props.tableData[0].key !== undefined);

    window.addEventListener('scroll', this.onScrollWindow);
    // window.addEventListener('resize', this.onResize.bind(this));

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
      sliderValue: 0
    };
  }

  componentDidMount() {
    this.onResize();


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
    const diff = window.scrollY - headerTop;

    if (diff > 0) {
      headerIsFixed = true;
      moveHeader(this.table.tHead, diff);
    } else if (headerIsFixed) {
      headerIsFixed = false;
      this.table.tHead.style.transform = '';
    }
  }

  onResize() {
    headerTop = this.table.tHead.getBoundingClientRect().top
                - document.body.getBoundingClientRect().top;
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

  // trackSlider = () => {
    // dispatch(trackEvent('project_area.submittals.table_actions.horizontal_scroll'));
  // }

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
  //   this.setState({ sliderValue: parseInt(v, 0) });
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
  //   const sliderValue = (bodyContainer.scrollLeft * delta) / scrollWidth;
  //
  //   this.setState({ sliderValue });
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
      <div className={styles.container}>
        <table className={styles.table} ref={(el) => { this.table = el; }}>
          { RipangaHeadRow({
            allChecked,
            allCollapsed,
            columnDefinitions,
            idKey,
            onCheckAll: this.onCheckAll,
            onCollapseAll: this.onCollapseAll,
            showGroups,
            showCheckboxes,
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
            renderBodyRow,
            showGroups,
            showCheckboxes,
            styles,
            tableData
          }) }
        </table>

        {/* <div className={styles.stickyContainer} ref={(el) => { this.stickyContainer = el; }}>
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
        </div> */}
      </div>
    );
  }
}
