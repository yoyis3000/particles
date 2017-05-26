import React from 'react';
import { render } from 'react-dom';
import LocationPicker from '../components/LocationPickerWithCreator';
import LocationToggle from '../components/LocationToggle';
import wrapProvider from 'decorators/wrapProvider';
import locationReducer from 'redux/ducks/location';
import modalReducer from 'redux/ducks/modal';

export const BootstrappedPicker =
  wrapProvider(
    { locations: locationReducer, modal: modalReducer },
    LocationPicker
  );
export const BootstrappedToggle =
  wrapProvider(
    { locations: locationReducer, modal: modalReducer },
    LocationToggle
  );

// TODO: Remove this after procore#12611 is merged
export function mountLocationPicker(node, props) {
  render(<BootstrappedPicker {...props} />, node);
}

// TODO: Remove this after procore#12611 is merged
export function mountLocationToggle(node, props) {
  render(<BootstrappedToggle {...props} />, node);
}
