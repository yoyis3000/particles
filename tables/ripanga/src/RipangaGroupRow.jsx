import React, { PropTypes } from 'react';

import RipangaCaret from './RipangaCaret';
import styles from './Ripanga.scss';

const RipangaGroupRow = ({
  colSpan,
  groupData,
  isChecked,
  isCollapsed,
  isDisabled,
  onCheck,
  onCollapse,
  showCheckboxes,
  titleElement
}) => {
  const onCaretClick = () => {
    if (isDisabled === false) {
      onCollapse(groupData.key.name);
    }
  };

  const onChange = () => {
    onCheck(groupData.key.name);
  };

  const checkbox = (showCheckboxes
    ? <input type='checkbox' checked={isChecked} onChange={onChange} />
    : null);

  const caret = RipangaCaret({ disabled: isDisabled, closed: isCollapsed, onClick: onCaretClick });

  return (
    <tr className={styles.groupRow} key={`group-${groupData.key.name}`}>
      <td colSpan={colSpan}>
        <div className={styles.controls}>
          {caret}
          {checkbox}
        </div>
        <span className={styles.title}>{titleElement}</span>
      </td>
    </tr>
  );
};

/* eslint-disable react/require-default-props */
RipangaGroupRow.propTypes = {
  onCollapse: PropTypes.func.isRequired,
  colSpan: PropTypes.number.isRequired,
  groupData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isChecked: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onCheck: PropTypes.func,
  showCheckboxes: PropTypes.bool.isRequired,
  titleElement: PropTypes.element
};

export default RipangaGroupRow;
