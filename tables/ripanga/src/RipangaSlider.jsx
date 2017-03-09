import React, { PropTypes } from 'react';
import Range from 'react-range';

const RipangaSlider = ({
  onClick,
  onScroll,
  styles,
  value
}) => (<Range
  className={styles.slider}
  max='50'
  min='0'
  onChange={onScroll}
  onClick={onClick}
  type='range'
  value={value}
/>);

RipangaSlider.propTypes = {
  onClick: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
  styles: PropTypes.shape().isRequired,
  value: PropTypes.number.isRequired
};

export default RipangaSlider;
