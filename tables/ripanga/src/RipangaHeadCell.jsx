import React, { PropTypes } from 'react';
import cx from 'classnames';
import { SORT_DIRECTION } from './Ripanga';

const RipangaHeadCell = ({
  def,
  onSort,
  sortState,
  styles
}) => {
  const onClick = () => {
    if (def.sortable === false) {
      return;
    }

    onSort(def);
  };

  let arrow = null;
  if (sortState.attribute && sortState.attribute === def.sortKey && sortState.direction !== SORT_DIRECTION.NONE) {
    arrow = (sortState.direction === SORT_DIRECTION.DESC
      ? <i className='fa fa-long-arrow-down' />
      : <i className='fa fa-long-arrow-up' />);
  }

  if (!def.key) {
    // eslint-disable-next-line
    console.error(`Column definition for "${def.label}" has no 'key' property. This might cause the error below.`);
  }

  return (
    <div
      className={cx(styles.headCell, styles[`w${def.width}px`], { [styles.sortable]: def.sortable })}
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
  sortState: PropTypes.shape().isRequired,
  styles: PropTypes.shape().isRequired
};

export default RipangaHeadCell;
