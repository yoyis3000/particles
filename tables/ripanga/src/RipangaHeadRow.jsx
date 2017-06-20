import React from 'react';
import PropTypes from 'prop-types';
import RipangaCaret from './RipangaCaret';
import RipangaHeadCell from './RipangaHeadCell';

let headerInitialTop = 0;

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

export default class RipangaHeadRow extends React.Component {
  static propTypes = {
    allChecked: PropTypes.bool.isRequired,
    allCollapsed: PropTypes.bool.isRequired,
    columnDefinitions: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCheckAll: PropTypes.func.isRequired,
    onCollapseAll: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
    showCheckboxes: PropTypes.bool.isRequired,
    showGroups: PropTypes.bool.isRequired,
    sortState: PropTypes.shape().isRequired,
    styles: PropTypes.shape().isRequired,
    tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', debounce(this.onResize, 100));
    this.setHeaderInitialTop();
    this.onResize();
  }

  componentDidUpdate() {
    const currentHeaderTop = this.header.getBoundingClientRect().top;
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    if (scrollTop <= headerInitialTop || currentHeaderTop > headerInitialTop) {
      this.setHeaderInitialTop();
    }

    this.onResize();
    this.onScroll();
  }

  onScroll = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    if (scrollTop > headerInitialTop) {
      moveHeader(this.header, scrollTop - headerInitialTop);
    } else {
      restoreHeader(this.header);
    }
  }

  onResize = () => {
    // Having each cell move individually is good for inheriting sizes but bad for perf. Ben 170411
    const sidebarCells = document.querySelectorAll(`.${this.props.styles.sidebarCell.split(' ').shift()}`);
    const tableRows = document.querySelectorAll(`.${this.props.styles.tableRow.split(' ').shift()}`);
    const len = tableRows.length;

    const tableData = this.props.tableData;
    const showGroups = (tableData.length > 0 && tableData[0].key !== undefined);

    for (let i = 0; i < len; i += 1) {
      sidebarCells[i].style.height = `${tableRows[i].offsetHeight}px`;
    }

    // Required for <div> elements to maintain background color for full scroll width. Ben 170411
    let initialWidth = 0;

    if (showGroups) {
      initialWidth += 30;
    }

    if (this.props.showCheckboxes) {
      initialWidth += 42;
    }

    const tableWidth = this.props.columnDefinitions
      .reduce((acc, def) => (def.hidden ? acc : acc + def.width), initialWidth);

    this.header.style.minWidth = `${tableWidth}px`;

    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    if (scrollTop <= headerInitialTop) {
      this.setHeaderInitialTop();
    }

    this.onScroll();
  }

  setHeaderInitialTop = () => {
    const currentHeaderTop = this.header.getBoundingClientRect().top;
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    headerInitialTop = currentHeaderTop + scrollTop;
  }

  render() {
    const {
      allChecked,
      allCollapsed,
      columnDefinitions,
      onCheckAll,
      onCollapseAll,
      onSort,
      showGroups,
      showCheckboxes,
      sortState,
      styles
    } = this.props;

    const cells = columnDefinitions.reduce((acc, def) => {
      if (def.hidden !== true) {
        acc.push(RipangaHeadCell({ def, onSort, sortState, styles }));
      }

      return acc;
    }, []);

    if (showCheckboxes || showGroups) {
      const checkbox = (showCheckboxes
        ? (<label className={styles.controlCheckbox}>
          <input type='checkbox' checked={allChecked} onChange={onCheckAll} />
        </label>)
        : null);

      const caret = (showGroups
        ? RipangaCaret({ closed: allCollapsed, onClick: onCollapseAll })
        : null);

      cells.unshift(
        <div key='head-controls' className={styles.controlHeadCell}>
          {caret}
          {checkbox}
        </div>
      );
    }

    return <div className={styles.headRow} ref={(el) => { this.header = el; }}>{cells}</div>;
  }
}
