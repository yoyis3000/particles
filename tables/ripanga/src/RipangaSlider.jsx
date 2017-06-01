import React from 'react';
import PropTypes from 'prop-types';
import Range from 'react-range';

const RipangaSlider = ({
  onScroll,
  onScrollTrack,
  styles,
  value
}) => (<Range
  className={styles.slider}
  max='50'
  min='0'
  onChange={onScroll}
  onClick={onScrollTrack}
  type='range'
  value={value}
/>);

RipangaSlider.propTypes = {
  onScroll: PropTypes.func.isRequired,
  onScrollTrack: PropTypes.func.isRequired,
  styles: PropTypes.shape().isRequired,
  value: PropTypes.number.isRequired
};

export default RipangaSlider;
