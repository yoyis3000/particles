import React, { PropTypes } from 'react';
import qs from 'qs';
import cx from 'classnames';
import styles from './Wharangi.scss';

export default class Wharangi extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func,
    perPage: PropTypes.number,
    pagesToShow: PropTypes.number,
    totalRecords: PropTypes.number,
  };

  static defaultProps = {
    onSelect: null,
    perPage: 150,
    pagesToShow: 3,
    totalRecords: 0,
  };

  static updateUrl(newParams) {
    const url = window.location.href.split('?');
    const params = qs.parse(url[1]);
    const updatedParams = Object.assign(params, newParams);

    const tmp = qs.stringify(updatedParams, { arrayFormat: 'brackets' });
    history.pushState(history.state, '', `${url[0]}?${tmp}`);
  }

  constructor(props) {
    super(props);

    const totalPages = Math.ceil(props.totalRecords / props.perPage);

    const url = window.location.href.split('?');
    const params = qs.parse(url[1]);
    const paramPage = parseInt(params.page, 10) || 1;
    const page = Math.max(1, Math.min(paramPage, totalPages));

    Wharangi.updateUrl({ per_page: props.perPage, page });

    this.state = { activePage: page };
  }

  handleSelect(page) {
    if (this.state.activePage === page) {
      return;
    }

    this.setState({ activePage: page });
    Wharangi.updateUrl({ page });
    this.props.onSelect();
  }

  render() {
    const {
      pagesToShow,
      perPage,
      totalRecords,
    } = this.props;

    const {
      activePage,
    } = this.state;

    const totalPages = Math.ceil(totalRecords / perPage);

    const recordRange = {
      start: ((activePage - 1) * perPage) + 1,
      end: Math.min(activePage * perPage, totalRecords),
    };

    const start = activePage > 2 ? activePage - 1 : 1;
    const pageRange = {
      start,
      end: Math.min(start + (pagesToShow - 1), totalPages),
    };


    const msg = (totalRecords === 0)
      ? 'Displaying 0'
      : `Displaying ${recordRange.start || 0} - ${recordRange.end || 0}`;

    const items = [];
    for (let i = pageRange.start; i <= pageRange.end; i++) {
      items.push(<button
        key={`page-${i}`}
        className={cx(styles.item, { [styles.active]: i === activePage })}
        onClick={() => this.handleSelect(i)}
      >
        {i}
      </button>);
    }

    const firstitem = (activePage > 2)
      ? (<button
        className={styles.item}
        onClick={() => this.handleSelect(1)}
      >1</button>)
      : null;

    const prev = (activePage > 2)
      ? (<button
        onClick={() => this.handleSelect(activePage - 1)}
        className={cx('fa', 'fa-angle-left', styles.prev)}
      />)
      : null;

    const prevEllipsis = (activePage > 2)
      ? <span className={styles.ellipsis}>&hellip;</span>
      : null;

    const next = (activePage < totalPages - 1)
      ? (<button
        onClick={() => this.handleSelect(activePage + 1)}
        className={cx('fa', 'fa-angle-right', styles.prev)}
      />)
      : null;

    const nextEllipsis = (activePage < totalPages - 1)
      ? <span className={styles.ellipsis}>&hellip;</span>
      : null;

    const lastitem = (activePage < totalPages - 1)
      ? (<button
        className={styles.item}
        onClick={() => this.handleSelect(totalPages)}
      >
        {totalPages}
      </button>)
      : null;

    // TEST:
    // empty case
    // end ellipsis
    // start ellipsis
    // URL hack pages

    return (
      <div className={styles.paginator}>
        <div className={styles.meta}>{`${msg} of ${totalRecords || 0}`}</div>
        {prev}
        {firstitem}
        {prevEllipsis}
        {items}
        {nextEllipsis}
        {lastitem}
        {next}
      </div>
    );
  }
}
