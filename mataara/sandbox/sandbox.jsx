import React from 'react';
import { render } from 'react-dom';
import Mataara, { TYPES } from '../src';

const onCancel = () => {
  console.warn("The notification has been cancelled.");
};

render(
  <div>
    <Mataara
      onCancel={onCancel}
      type={TYPES.SUCCESS}
      title="Success"
      body="This is a success notification."
    />
    <Mataara
      onCancel={onCancel}
      type={TYPES.INFO}
      title="Info"
      body="This is a error notification."
    />
    <Mataara
      onCancel={onCancel}
      type={TYPES.ERROR}
      title="Error"
      body="This is a error notification."
    />
    <Mataara
      title="Default"
      body="This is a default notification."
    />
    <Mataara
      noDismiss={true}
      type={TYPES.ERROR}
      title="Non-dismissable"
      body="This is a notification that can't be dismissed."
    />
  </div>,
  window.document.getElementById('root'),
);
