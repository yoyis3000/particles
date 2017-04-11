import React, { PropTypes } from 'react';

import RipangaCaret from './RipangaCaret';

const RipangaGroupRow = ({
  groupData,
  isChecked,
  isCollapsed,
  isDisabled,
  onCheck,
  onCollapse,
  showCheckboxes,
  showGroups,
  styles,
  titleElement
}) => {
  const onCaretClick = () => {
    if (isDisabled === false) {
      onCollapse(groupData.key.key);
    }
  };

  const onChange = () => {
    onCheck(groupData.key.key);
  };

  const cells = [];

  if (showCheckboxes || showGroups) {
    const checkbox = (showCheckboxes
      ? (<label className={styles.controlCheckbox}>
        <input type='checkbox' checked={isChecked} onChange={onChange} />
      </label>)
      : null);

    const caret = RipangaCaret({
      closed: isCollapsed,
      disabled: isDisabled,
      onClick: onCaretClick
    });

    cells.push(<div key={`group-control-${groupData.key.key}`} className={styles.controlCell}>
      {caret}
      {checkbox}
    </div>);
  }

  cells.push(<div key={`group-title-${groupData.key.key}`} className={styles.groupCell}>
    {titleElement}
  </div>);

  return (
    <div className={styles.groupRow} key={`group-${groupData.key.key}`}>
      {cells}
    </div>
  );
};

/* eslint-disable react/require-default-props */
RipangaGroupRow.propTypes = {
  onCollapse: PropTypes.func.isRequired,
  groupData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isChecked: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onCheck: PropTypes.func,
  showCheckboxes: PropTypes.bool.isRequired,
  showGroups: PropTypes.bool.isRequired,
  styles: PropTypes.shape().isRequired,
  titleElement: PropTypes.element
};

export default RipangaGroupRow;
