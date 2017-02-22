import React from 'react';
import styles from './Tatari.scss';

const TatariFilterHead = (onRemove, text, count) => {
  const adjustedCount = (count ? `(${count})` : null);

  return (
    <div className={styles['filter-head']}>
      <div
        className={`${styles['filter-head-remove']} fa fa-times`}
        onClick={onRemove}
      ></div>
      {text} {adjustedCount}
    </div>
  );
};

TatariFilterHead.propTypes = {
  item: React.PropTypes.shape({
    // key: React.PropTypes.string,
    // value: React.PropTypes.string,
  }),
};
export default TatariFilterHead;
