import React from 'react';
import { render } from 'react-dom';

render(
  <h1>Hello world!</h1>,
  document.getElementById('root')
);

// import { connect } from 'react-redux';
//
// import Modal from './Modal';
// import MountLock from './MountLock';
// import ShowLock from './ShowLock';
// import ModalManager from './ModalManager';
//
// import modalSelector from './selector';
// import modalDispatch from './dispatch';
//
// const ConnectedModal = connect(modalSelector, modalDispatch)(Modal);
//
// export const StatefulModal = ModalManager(Modal);
// export const ModalMountLock = MountLock(ConnectedModal);
// export const ModalShowLock = ShowLock(ConnectedModal);
// export default ConnectedModal;
