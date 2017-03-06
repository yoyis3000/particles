import React, { PropTypes } from 'react';

import RipangaCaret from './RipangaCaret';
import styles from './Ripanga.scss';

const RipangaGroupRow = ({
  actions,
  globalKey,
  checkedIds,
  collapseGroup,
  colSpan,
  groupData,
  groupIndex,
  isCollapsed,
  isDisabled,
  showCheckboxes,
  titleElement
}) => {
  const indices = groupData.data.map(v => v.id);

  const checkedCount = indices.reduce((acc, i) => {
    if (checkedIds.get(i)) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const onChange = (evt) => {
    evt.target.checked
      ? actions.setChecked({ ids: indices, globalKey })
      : actions.setUnchecked({ ids: indices, globalKey });
  };

  const onCaretClick = () => {
    if (isDisabled === false) {
      collapseGroup(groupIndex);
    }
  };

  const checkbox = (showCheckboxes
    ? <input type='checkbox' checked={indices.length === checkedCount} onChange={onChange} />
    : null);

  return (
    <tr className={styles.groupRow}>
      <td colSpan={colSpan}>
        <div className={styles.controls}>
          {checkbox}
          <RipangaCaret disabled={isDisabled} closed={isCollapsed} onClick={onCaretClick} />
        </div>
        <span className={styles.title}>{titleElement}</span>
      </td>
    </tr>
  );
};

RipangaGroupRow.propTypes = {
  actions: PropTypes.shape(),
  checkedIds: PropTypes.shape(),
  collapseGroup: PropTypes.func.isRequired,
  colSpan: PropTypes.number.isRequired,
  globalKey: PropTypes.string.isRequired,
  groupData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  groupIndex: PropTypes.number.isRequired,
  isCollapsed: PropTypes.bool,
  isDisabled: PropTypes.bool,
  showCheckboxes: PropTypes.bool.isRequired,
  titleElement: PropTypes.element
};

RipangaGroupRow.defaultProps = {
  actions: PropTypes.shape(),
  checkedIds: PropTypes.shape(),
  idKey: 'id',
  isCollapsed: false,
  isDisabled: false,
  renderBodyRow: null,
  renderGroupTitle: null,
  renderGroupPaneContent: null,
  titleElement: null
};

export default RipangaGroupRow;
