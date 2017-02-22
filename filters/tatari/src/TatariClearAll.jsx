import React from 'react';
import styles from './Tatari.scss';

const TatariClearAll = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles['clear-all-filters']}
    >
      Clear All
    </button>
  );
};

// TatariItem.propTypes = {
//   item: React.PropTypes.shape({
//     // key: React.PropTypes.string,
//     // value: React.PropTypes.string,
//   }),
// };

export default TatariClearAll;
