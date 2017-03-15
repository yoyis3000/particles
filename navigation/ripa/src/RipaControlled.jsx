import React, { PropTypes } from 'react';
import qs from 'qs';
import Ripa from './Ripa';

const onRipaChange = (scope, handler) => (k, v, index) => {
  const url = window.location.href.split('?');
  const params = qs.parse(url[1]);

  if (params.view !== k) {
    const newParams = Object.assign(params, { view: k });
    history
      .pushState(
        history.state,
        '',
        `${url[0]}?${qs.stringify(newParams, { arrayFormat: 'brackets' })}`);
    handler(k, v, index);
  }
};

const RipaControlled = ({
  onChange,
  scope,
  ...props
}) => {
  const getCurrentViewFromBrowser = () => {
    const params = qs.parse(window.location.search.substr(1));
    return params.view || props.labels[0].k;
  };

  return (<Ripa
    {...props}
    onChange={onRipaChange(scope, onChange)}
    selectedKey={getCurrentViewFromBrowser(scope)}
  />);
};

RipaControlled.propTypes = {
  ...Ripa.propTypes,
  scope: PropTypes.string
};

RipaControlled.defaultProps = {
  scope: 'procore'
};

export default RipaControlled;
