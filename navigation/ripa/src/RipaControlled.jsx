import React, { PropTypes } from 'react';
import qs from 'qs';
import Ripa from './Ripa';

const onRipaLoad = (scope) => {
  const view = localStorage.getItem(`${scope}/VIEW`);

  if (view) {
    const url = window.location.href.split('?');
    const params = qs.parse(url[1]);

    const newParams = Object.assign(params, { view });
    history
      .pushState(
        history.state,
        '',
        `${url[0]}?${qs.stringify(newParams, { arrayFormat: 'brackets' })}`);
  }
};

const onRipaChange = (scope, handler) => (k, v, index) => {
  const url = window.location.href.split('?');
  const params = qs.parse(url[1]);

  if (params.view !== k) {
    localStorage.setItem(`${scope}/VIEW`, k);

    const newParams = Object.assign(params, { view: k });
    history
      .pushState(
        history.state,
        '',
        `${url[0]}?${qs.stringify(newParams, { arrayFormat: 'brackets' })}`);
    handler(k, v, index);
  }
};

const getCurrentViewFromBrowser = (scope) => {
  const params = qs.parse(window.location.search.substr(1));
  return params.view || localStorage.getItem(`${scope}/VIEW`);
};

const RipaControlled = ({
  onChange,
  scope,
  ...props
}) => {
  onRipaLoad(scope);

  return (
    <Ripa
      {...props}
      onChange={onRipaChange(scope, onChange)}
      selectedKey={getCurrentViewFromBrowser(scope)}
    />
  );
};

RipaControlled.propTypes = {
  ...Ripa.propTypes,
  scope: PropTypes.string
};

RipaControlled.defaultProps = {
  scope: 'ripa'
};

export default RipaControlled;
