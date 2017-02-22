import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './Uta.scss';

const Uta = (props) => {
  const {
    children,
    className,
    Component,
    isLoading,
    titleText,
  } = props;
  const classes = cx(
    className,
    styles.asyncLoad,
    { [styles.loading]: isLoading },
  );

  return (
    <Component className={classes} data-text={titleText}>
      <div className={styles.asyncLoadFadeContainer}>
        {children}
      </div>
    </Component>
  );
};

Uta.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  isLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  titleText: PropTypes.string,
};

Uta.defaultProps = {
  children: null,
  className: null,
  Component: 'div',
  isLoading: false,
  titleText: 'Loading',
};

export default Uta;
