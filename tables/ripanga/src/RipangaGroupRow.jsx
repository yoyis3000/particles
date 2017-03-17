import React, { PropTypes } from 'react';

import RipangaCaret from './RipangaCaret';

const RipangaGroupRow = ({
  colSpan,
  groupData,
  isChecked,
  isCollapsed,
  isDisabled,
  onCheck,
  onCollapse,
  renderGroupStickyCell,
  showCheckboxes,
  styles,
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
    ? <label className={styles.controlCheckbox}><input type='checkbox' checked={isChecked} onChange={onChange} /></label>
    : null);

  const caret = RipangaCaret({ disabled: isDisabled, closed: isCollapsed, onClick: onCaretClick });

  const sticky = (renderGroupStickyCell
    ? renderGroupStickyCell(groupData)
    : null);

  return (
    <tr className={styles.groupRow} key={`group-${groupData.key.key}`}>
      <td className={styles.controlCell}>
        {caret}
        {checkbox}
      </td>
      <td colSpan={colSpan} className={styles.groupCell}>
        {titleElement}
      </td>
      <td className={styles.stickyCell}>
        {sticky}
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
  renderGroupStickyCell: PropTypes.func,
  showCheckboxes: PropTypes.bool.isRequired,
  styles: PropTypes.shape().isRequired,
  titleElement: PropTypes.element
};

export default RipangaGroupRow;
