import React, { PropTypes } from 'react';

const CheckboxCell = ({
  checked,
  onSelect,
  onDeselect
}) => (
  <td>
    <input
      type='checkbox'
      checked={checked}
      onChange={({ target }) => {
        target.checked ? onSelect() : onDeselect();
      }}
    />
  </td>
);

CheckboxCell.propTypes = {
  checked: PropTypes.bool,
  onDeselect: PropTypes.func,
  onSelect: PropTypes.func
};

CheckboxCell.defaultProps = {
  checked: false,
  onDeselect: null,
  onSelect: null
};

export default CheckboxCell;
