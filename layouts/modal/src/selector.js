import { createSelector, createStructuredSelector } from 'reselect';
import { Map } from 'immutable';
import { ensureState } from 'redux-optimistic-ui';

const modalRootSelector = state => ensureState(state).modal;
const scopeSelector = (state, props) => props.scope;

const scopedModalSelector = createSelector(
  modalRootSelector,
  scopeSelector,
  (state, scope) => state.get(scope, Map())
);

const marginTopSelector = createSelector(
  scopedModalSelector,
  session => session.get('marginTop', 0)
);

const marginLeftSelector = createSelector(
  scopedModalSelector,
  session => session.get('marginLeft', 0)
);

const heightSelector = createSelector(
  scopedModalSelector,
  session => session.get('height', 'auto')
);

const innerHeightSelector = createSelector(
  scopedModalSelector,
  session => session.get('innerHeight', 'auto')
);

const modalSelector = createStructuredSelector({
  marginTop: marginTopSelector,
  marginLeft: marginLeftSelector,
  height: heightSelector,
  innerHeight: innerHeightSelector,
});

export default modalSelector;
