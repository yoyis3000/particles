import React from 'react';
import PropTypes from 'prop-types';
import composeStyles from '../../../shared/stylesheetComposer';

import baseStyles from './BulkEditor.scss';

const keyGen = (item, valueField) => (
  valueField ? item[valueField] : item
);

const BulkEditor = ({
  cancelText,
  children,
  itemFormatter,
  items,
  itemsTitle,
  onCancel,
  onRemove,
  onSubmit,
  stylesheets,
  submitText,
  valueField
}) => {
  const styles = composeStyles(baseStyles, stylesheets);

  return (
    <div className={styles.container}>
      <span className={styles.itemsTitle}>{itemsTitle}</span>

      <div className={styles.subContainer}>
        <div className={styles.selectedItems}>
          <div className={`${styles.container} ${styles.itemsContainer}`}>
            {items.map(item =>
              <div className={styles.itemContainer} key={`bulk-editor-item-${keyGen(item, valueField)}`}>
                <button type='button' className={`fa fa-times ${styles.removeButton}`} onClick={() => onRemove(item)} />
                {itemFormatter(item)}
              </div>
            )}
          </div>
        </div>

        <div className={styles.fields} id='batch-editor-fields'>
          <div className={styles.fieldsContainer}>
            {children}
          </div>
        </div>
      </div>

      <span className={styles.footer}>
        <a className={styles.cancel} onClick={onCancel}>{cancelText}</a>
        <button type='button' className={styles.submitButton} onClick={onSubmit}>
          {submitText}
        </button>
      </span>
    </div>
  );
};

BulkEditor.propTypes = {
  cancelText: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.any]),
  itemFormatter: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.any])),
  itemsTitle: PropTypes.string,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
  onSubmit: PropTypes.func,
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
  onCancel: () => console.log('No onCancel was passed to BulkEditor'), // eslint-disable-line
  onRemove: () => console.log('No onRemove was passed to BulkEditor'), // eslint-disable-line
  onSubmit: () => console.log('No onSubmit was passed to Bulk Editor'), // eslint-disable-line
  stylesheets: [],
  submitText: 'Update',
  valueField: null
};

export default BulkEditor;
