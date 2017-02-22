import React from 'react';
import styles from './Tatari.scss';

const TatariPlainItem = ({
  item,
}) => {
  return (
    <div className={styles['plain-item']}>{item.text}</div>
  );
};

TatariPlainItem.propTypes = {
  item: React.PropTypes.shape({
    // key: React.PropTypes.string,
    // value: React.PropTypes.string,
  }),
};
export default TatariPlainItem;
