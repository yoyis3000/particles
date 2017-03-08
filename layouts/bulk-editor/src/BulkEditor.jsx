import React, { PropTypes } from 'react';
import styles from './BulkEditor.scss';

const BulkEditor = ({ items, itemsTitle }) =>
  <div className={styles.container}>
    <span className={styles.itemsTitle}>{itemsTitle}</span>

    <div className={styles.subContainer}>
      <div className={styles.selectedItems}>
        <div className={`${styles.container} ${styles.itemsContainerSpacing}`}>
          {items.map(item =>
            <div>
              <button type='button' className={`fa fa-times ${styles.removeButton}`} onClick={() => {}} />
              {item}: {item}
            </div>
          )}
        </div>
      </div>

      <div className={styles.fields}>
        <div className={styles.fieldsSpacing}>
          Some Nick Pickers here
        </div>
      </div>
    </div>
  </div>;

BulkEditor.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()),
  itemsTitle: PropTypes.string
};

BulkEditor.defaultProps = {
  items: [],
  itemsTitle: 'Selected Items: '
};

export default BulkEditor;
