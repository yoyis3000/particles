import React, { PropTypes } from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import styles from './Kaweake.scss';

const i18n = {
  placeholder: 'Export',
};

const Kaweake = ({className, generateExport, options}) =>
  <DropdownList
    className={className}
    data={options}
    onChange={({ format }) => generateExport(format)}
    placeholder={i18n.placeholder}
    textField="name"
    value=""
    valueField="format"
  />;

Kaweake.propTypes = {
  className: PropTypes.string,
  generateExport: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
};

Kaweake.defaultProps = {
  className: '',
  options: [],
};

export default Kaweake;
