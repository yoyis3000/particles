import React, { PropTypes } from 'react';
import qs from 'qs';
import cx from 'classnames';
import baseStyles from './Wharangi.scss';
import composeStyles from '../../../shared/stylesheetComposer';

export default class Wharangi extends React.Component {
  static propTypes = {
    active: PropTypes.number,
    i18n: PropTypes.shape(),
    onMount: PropTypes.func,
    onSelect: PropTypes.func,
    pagesToShow: PropTypes.number,
    perPage: PropTypes.number,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    totalRecords: PropTypes.number
  };

  static defaultProps = {
    active: 1,
    i18n: { displaying: 'Displaying', of: 'of' },
    onMount: () => {},
    onSelect: null,
    pagesToShow: 3,
    perPage: 150,
    stylesheets: [],
    totalRecords: 0
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

    this.styles = composeStyles(baseStyles, [...props.stylesheets]);
  }

  componentDidMount() {
    const { onMount } = this.props;

    onMount();
  }

  handleSelect(page) {
    const { onSelect, active } = this.props;

    if (active === page) {
      return;
    }

    onSelect(page);
  }

  render() {
    const {
      active,
      i18n,
      pagesToShow,
      perPage,
      totalRecords
    } = this.props;

    const totalPages = Math.ceil(totalRecords / perPage);

    const recordRange = {
      start: ((active - 1) * perPage) + 1,
      end: Math.min(active * perPage, totalRecords)
    };

    const start = active > 2 ? active - 1 : 1;
    const pageRange = {
      start,
      end: Math.min(start + (pagesToShow - 1), totalPages)
    };

    const msg = (totalRecords === 0)
      ? `${i18n.displaying} 0`
      : `${i18n.displaying} ${recordRange.start || 0} - ${recordRange.end || 0}`;

    const items = [];
    for (let i = pageRange.start; i <= pageRange.end; i++) {
      items.push(<button
        key={`page-${i}`}
        className={cx(this.styles.item, { [this.styles.active]: i === active })}
        onClick={() => this.handleSelect(i)}
      >
        {i}
      </button>);
    }

    const firstitem = (active > 2)
      ? (<button
        className={this.styles.item}
        onClick={() => this.handleSelect(1)}
      >1</button>)
      : null;

    const prev = (active > 2)
      ? (<button
        onClick={() => this.handleSelect(active - 1)}
        className={cx('fa', 'fa-angle-left', this.styles.prev)}
      />)
      : null;

    const prevEllipsis = (active > 2)
      ? <span className={this.styles.ellipsis}>&hellip;</span>
      : null;

    const next = (active < totalPages - 1)
      ? (<button
        onClick={() => this.handleSelect(active + 1)}
        className={cx('fa', 'fa-angle-right', this.styles.prev)}
      />)
      : null;

    const nextEllipsis = (active < totalPages - 1)
      ? <span className={this.styles.ellipsis}>&hellip;</span>
      : null;

    const lastitem = (active < totalPages - 1)
      ? (<button
        className={this.styles.item}
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
      <div className={this.styles.paginator}>
        <div className={this.styles.meta}>{`${msg} ${i18n.of} ${totalRecords || 0}`}</div>
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
