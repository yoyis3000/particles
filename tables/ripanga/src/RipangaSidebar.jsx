import React from 'react';
import PropTypes from 'prop-types';

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

export default class RipangaSidebar extends React.Component {
  static propTypes = {
    collapsedIds: PropTypes.shape(),
    idKey: PropTypes.string.isRequired,
    renderSidebarBodyCell: PropTypes.func,
    renderSidebarHeadCell: PropTypes.func,
    renderSidebarGroupCell: PropTypes.func,
    showGroups: PropTypes.bool.isRequired,
    styles: PropTypes.shape().isRequired,
    tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  static defaultProps = {
    renderSidebarBodyCell: null,
    renderSidebarHeadCell: null,
    renderSidebarGroupCell: null
  }

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

    this.onScroll();
  }

  onResize = () => {
    if (this.header === null) {
      return;
    }

    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    if (scrollTop <= headerInitialTop) {
      this.setHeaderInitialTop();
    }

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

  setHeaderInitialTop = () => {
    const currentHeaderTop = this.header.getBoundingClientRect().top;
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    headerInitialTop = currentHeaderTop + scrollTop;
  }

  render() {
    const {
      collapsedIds,
      idKey,
      renderSidebarBodyCell,
      renderSidebarGroupCell,
      renderSidebarHeadCell,
      showGroups,
      styles,
      tableData
    } = this.props;

    const renderSidebarCell = group => group.data.map((rowData) => {
      const groupKey = group.key && group.key.key;
      const cell = renderSidebarBodyCell ? renderSidebarBodyCell(rowData) : null;

      return !collapsedIds[groupKey] ? (
        <div key={`${rowData[idKey]}-sidebar`} className={styles.sidebarCell}>{cell}</div>
      ) : (
        <div key={`${rowData[idKey]}-sidebar-hide`} />
      );
    });

    const renderGroupSidebarCell = (groupData) => {
      const cell = (renderSidebarGroupCell ? renderSidebarGroupCell(groupData) : null);
      return <div key={`group-sidebar-${groupData.key.key}`} className={styles.groupSidebarCell}>{cell}</div>;
    };

    const renderGroupSidebarCells = () => {
      const groups = [];
      tableData.forEach((group) => {
        groups.push(renderGroupSidebarCell(group));
        groups.push(...renderSidebarCell(group));
      });

      return groups;
    };

    const rows = (showGroups ? renderGroupSidebarCells() : renderSidebarCell(tableData[0]));

    const headCell = renderSidebarHeadCell ? renderSidebarHeadCell() : null;
    rows.unshift(<div
      key='sticky-head'
      className={styles.headSidebarCell}
      ref={(el) => { this.header = el; }}
    >{headCell}</div>);

    return <div className={styles.sidebarContainer}>{rows}</div>;
  }
}
