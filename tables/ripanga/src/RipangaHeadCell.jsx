import React, { PropTypes } from 'react';
import cx from 'classnames';
import qs from 'qs';

import styles from './Ripanga.scss';

const DIRECTION = { ASC: 'asc', DESC: 'desc' };

const RipangaHeadCell = ({
  def,
  onSort
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

  if (!def.sortKey) {
    // eslint-disable-next-line
    console.error(`Column definition for "${def.label}" has no sortKey property which causes the error below.`);
  }

  return (
    <th
      className={cx(styles.sortArrow, { [styles.sortable]: def.sortable })}
      key={`head-${def.sortKey}`}
      onClick={onClick}
    >
      <span className={styles.label}>{def.label}</span>
      {arrow}
    </th>
  );
};

RipangaHeadCell.propTypes = {
  def: PropTypes.shape().isRequired,
  onSort: PropTypes.func.isRequired
};

export default RipangaHeadCell;
