import React, { PropTypes } from 'react';
import styles from './BulkEditor.scss';

const keyGen = (item, valueField) => {
  if (typeof item === 'object') {
    return item[valueField];
  }

  return item;
};

const BulkEditor = ({ children, itemFormatter, items, itemsTitle, valueField }) =>
  <div className={styles.container}>
    <span className={styles.itemsTitle}>{itemsTitle}</span>

    <div className={styles.subContainer}>
      <div className={styles.selectedItems}>
        <div className={`${styles.container} ${styles.itemsContainer}`}>
          {items.map(item =>
            <div className={styles.itemContainer} key={`bulk-editor-item-${keyGen(item, valueField)}`}>
              <button type='button' className={`fa fa-times ${styles.removeButton}`} onClick={() => {}} />
              {itemFormatter(item)}
            </div>
          )}
        </div>
      </div>

      <div className={styles.fields}>
        <div className={styles.fieldsSpacing}>
          {children}
        </div>
      </div>
    </div>
  </div>;

BulkEditor.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]),
  itemFormatter: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.any])),
  itemsTitle: PropTypes.string,
  valueField: PropTypes.string
};

BulkEditor.defaultProps = {
  children: [],
  itemFormatter: item => item,
  items: [],
  itemsTitle: 'Selected Items: ',
  valueField: 'value'
};

export default BulkEditor;
