import React, { PropTypes } from 'react';
import composeStyles from '../../../shared/stylesheetComposer';

import baseStyles from './BulkEditor.scss';

let styles = {};

const keyGen = (item, valueField) => (
  valueField ? item[valueField] : item
);

// TODO: Button click handlers, will have to deal with table(?)

const BulkEditor = ({
  cancelText,
  children,
  itemFormatter,
  items,
  itemsTitle,
  stylesheets,
  submitText,
  valueField
}) => {
  styles = composeStyles(baseStyles, stylesheets);

  return (
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
          <div className={styles.fieldsContainer}>
            {children}
            <span className={styles.footer}>
              <a className={styles.cancel}>{cancelText}</a>
              <button type='button' className={styles.submitButton} onClick={() => {}}>
                {submitText}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

BulkEditor.propTypes = {
  cancelText: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.any]),
  itemFormatter: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.any])),
  itemsTitle: PropTypes.string,
  stylesheets: PropTypes.arrayOf(PropTypes.shape()),
  submitText: PropTypes.string,
  valueField: PropTypes.string
};

BulkEditor.defaultProps = {
  cancelText: 'Cancel',
  children: [],
  itemFormatter: item => item,
  items: [],
  itemsTitle: 'Selected Items: ',
  stylesheets: [],
  submitText: 'Update',
  valueField: null
};

export default BulkEditor;
