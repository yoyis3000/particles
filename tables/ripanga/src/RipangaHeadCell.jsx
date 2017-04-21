import React, { PropTypes } from 'react';
import cx from 'classnames';

import styles from './Ripanga.scss';

const DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
};

const RipangaHeadCell = ({
  def,
  globalKey,
  onSort,
  change,
  direction
}) => {

  let arrow = null;
  const sort = direction(def);

  if (sort) {
    const isDesc = sort === DIRECTION.DESC;
    arrow = <i className={cx({ fa: true, 'fa-long-arrow-down': isDesc, 'fa-long-arrow-up': !isDesc })} />
  }

  return (
    <th
      onClick={() => change(def)}
      className={cx(styles.sortArrow, {[styles.sortable]: def.sortable })}
    >
      <span className={styles.label}>{def.label}</span>
      {arrow}
    </th>
  );
};

RipangaHeadCell.propTypes = {
  def: PropTypes.shape(),
  globalKey: PropTypes.string,
  change: PropTypes.func,
  direction: PropTypes.func
};

RipangaHeadCell.defaultProps = {
  change: () => {},
  direction: () => {}
};

export default RipangaHeadCell;
