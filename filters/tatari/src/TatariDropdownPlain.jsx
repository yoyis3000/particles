import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const TatariDropdownPlain = ({
  data,
  i18n,
  isExpanded,
  isLoading,
  onChange,
  onExpand,
  styles
}) => {
  const items = data.reduce((acc, item) => {
    if (item.hidden !== true) {
      acc.push(<div
        key={`item-${item.key}`}
        data-key={item.key}
        className={styles.inactiveItem}
        onClick={onChange}
      >
        {item.value}
      </div>);
    }
    return acc;
  }, []);

  const text = <div className={styles.dropdownTitle}>{i18n.filter_placeholder}</div>;

  const loading = (isLoading
    ? <span className={styles.dropdownLoading} />
    : null);

  const caret = (isLoading || items.length === 0)
    ? null
    : (<div className={styles.dropdownCaret}>
      <span
        className={cx('fa', 'fa-caret-down', styles.arrow,
        { [styles.expanded]: isExpanded })}
      />
    </div>);

  return (<div className={styles.dropdownContainer}>
    <div
      className={cx(styles.dropdownHead, { [styles.expanded]: isExpanded })}
      data-key={'inactive'}
      onClick={onExpand}
    >
      {text}
      {caret}
      {loading}
    </div>

    <div className={cx(styles.dropdownBody, { [styles.expanded]: isExpanded })}>
      {items}
    </div>
  </div>);
};

TatariDropdownPlain.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    endpoint: PropTypes.string,
    key: PropTypes.string,
    value: PropTypes.string
  })).isRequired,
  i18n: PropTypes.shape(),
  isExpanded: PropTypes.bool,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  styles: PropTypes.shape().isRequired
};

TatariDropdownPlain.defaultProps = {
  i18n: {},
  isExpanded: false,
  isLoading: false
};

export default TatariDropdownPlain;
