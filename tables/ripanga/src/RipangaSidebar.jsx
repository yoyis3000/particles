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
    this.onResize();
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
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) ||
              document.body.scrollTop;

    headerInitialTop = this.header.getBoundingClientRect().top + scrollTop;

    this.onScroll();
  }

  render() {
    const {
      idKey,
      renderSidebarBodyCell,
      renderSidebarGroupCell,
      renderSidebarHeadCell,
      showGroups,
      styles,
      tableData
    } = this.props;

    const renderSidebarCell = group => group.data.map((rowData) => {
      const cell = renderSidebarBodyCell ? renderSidebarBodyCell(rowData) : null;
      return <div key={`${rowData[idKey]}-sidebar`} className={styles.sidebarCell}>{cell}</div>;
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
