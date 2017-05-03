import React, { PropTypes } from 'react';
import cx from 'classnames';
import qs from 'qs';

const DIRECTION = { ASC: 'asc', DESC: 'desc' };

const RipangaHeadCell = ({
  def,
  onSort,
  styles
}) => {
  const url = window.location.href.split('?');
  const params = qs.parse(url[1]);

  const onClick = () => {
    if (def.sortable === false) {
      return;
    }

    onSort();
  };

  let arrow = null;
  if (def.sortable === true && def.sortKey === params.sort.attribute) {
    arrow = (params.sort.direction === DIRECTION.DESC
      ? <i className='fa fa-long-arrow-down' />
      : <i className='fa fa-long-arrow-up' />);
  }

  if (!def.key) {
    // eslint-disable-next-line
    console.error(`Column definition for "${def.label}" has no 'key' property. This might cause the error below.`);
  }

  return (
    <div
      className={cx(styles.headCell, styles[`w${def.width}px`])}
      key={`head-${def.key}`}
      onClick={onClick}
    >
      <span className={styles.label}>{def.label}</span>
      {arrow}
    </div>
  );
};

RipangaHeadCell.propTypes = {
  def: PropTypes.shape().isRequired,
  onSort: PropTypes.func.isRequired,
  styles: PropTypes.shape().isRequired
};

export default RipangaHeadCell;
