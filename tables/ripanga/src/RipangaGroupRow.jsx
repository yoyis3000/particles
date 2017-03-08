import React, { PropTypes } from 'react';

import RipangaCaret from './RipangaCaret';
import styles from './Ripanga.scss';

const RipangaGroupRow = ({
  colSpan,
  globalKey,
  groupData,
  // isChecked,
  isCollapsed,
  isDisabled,
  onCollapse,
  showCheckboxes,
  titleElement
}) => {
  // const indices = groupData.data.map(v => v.id);
  //
  // const checkedCount = indices.reduce((acc, i) => {
  //   if (checkedIds[i]) {
  //     return acc + 1;
  //   }
  //
  //   return acc;
  // }, 0);

  const onChange = (evt) => {
    // evt.target.checked
    //   ? setChecked({ ids: indices, globalKey })
    //   : setUnchecked({ ids: indices, globalKey });
  };

  const onCaretClick = () => {
    if (isDisabled === false) {
      onCollapse(groupData.key.name);
    }
  };

  // const checkbox = (showCheckboxes
  //   ? <input type='checkbox' checked={indices.length === checkedCount} onChange={onChange} />
  //   : null);
  const checkbox = null;

  const caret = RipangaCaret({ disabled: isDisabled, closed: isCollapsed, onClick: onCaretClick });

  return (
    <tr className={styles.groupRow} key={`group-${groupData.key.name}`}>
      <td colSpan={colSpan}>
        <div className={styles.controls}>
          {checkbox}
          {caret}
        </div>
        <span className={styles.title}>{titleElement}</span>
      </td>
    </tr>
  );
};

RipangaGroupRow.propTypes = {
  onCollapse: PropTypes.func.isRequired,
  colSpan: PropTypes.number.isRequired,
  globalKey: PropTypes.string.isRequired,
  groupData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isCollapsed: PropTypes.bool,
  isDisabled: PropTypes.bool,
  showCheckboxes: PropTypes.bool.isRequired,
  titleElement: PropTypes.element
};

RipangaGroupRow.defaultProps = {
  checkedIds: PropTypes.shape(),
  idKey: 'id',
  isCollapsed: false,
  isDisabled: false,
  renderBodyRow: null,
  renderGroupTitle: null,
  titleElement: null
};

export default RipangaGroupRow;
