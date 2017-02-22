import { createAction, handleActions } from 'redux-actions';
import { Map, List } from 'immutable';
import qs from 'qs';

import { get, patch } from './TatariApi';
import { availableFiltersSelector, activeFiltersSelector } from './TatariSelector';

const memo = {};

const ACTIVE_REMOVE_ALL = 'tatari/ACTIVE_REMOVE_ALL';
const ACTIVE_REMOVE_EMPTY = 'tatari/ACTIVE_REMOVE_EMPTY';
const ACTIVE_REMOVE_ONE = 'tatari/ACTIVE_REMOVE_ONE';
const ACTIVE_SET_ALL_CLOSED = 'tatari/ACTIVE_SET_ALL_CLOSED';
const ACTIVE_SET_OPEN = 'tatari/ACTIVE_SET_OPEN';
const CHECK_ALL_CHECKBOXES = 'tatari/CHECK_ALL_CHECKBOXES';
const SET_LOADING = 'tatari/SET_LOADING';
const TOGGLE_CHECKBOX = 'tatari/TOGGLE_CHECKBOX';
const UNCHECK_ALL_CHECKBOXES = 'tatari/UNCHECK_ALL_CHECKBOXES';
export const activeRemoveAll = createAction(ACTIVE_REMOVE_ALL);
export const activeRemoveEmpty = createAction(ACTIVE_REMOVE_EMPTY);
export const activeRemoveOne = createAction(ACTIVE_REMOVE_ONE);
export const activeSetAllClosed = createAction(ACTIVE_SET_ALL_CLOSED);
export const activeSetOpen = createAction(ACTIVE_SET_OPEN);
export const checkAllCheckboxes = createAction(CHECK_ALL_CHECKBOXES);
export const setLoading = createAction(SET_LOADING);
export const toggleCheckbox = createAction(TOGGLE_CHECKBOX);
export const uncheckAllCheckboxes = createAction(UNCHECK_ALL_CHECKBOXES);

const I18N = {
  ball_in_court_id: 'Ball in Court',
  status: 'Status',
  location_id: 'Location',
  for_location_id_with_sublocations: 'Locations With Sublocations',
  assigned_id: 'Assignee',
  cost_code_id: 'Cost Code',
  received_from_login_information_id: 'Received From',
  responsible_contractor_id: 'Responsible Contractor',
};

// ===== Helper functions
const reduceAllFilters = (getState) => {
  const filterData = activeFiltersSelector(getState());

  const reduceSingle = (acc, value) => {
    if (value.key && value.checked === true) {
      acc.push(value.key);
    }

    return acc;
  };

  const reduceAll = (acc, values, key) => {
    acc[key] = values.reduce(reduceSingle, []);
    return acc;
  };

  return filterData.reduce(reduceAll, {});
};

// ==== Reducer actions
const ACTIVE_ADD_REJECT = 'tatari/ACTIVE_ADD_REJECT';
const ACTIVE_ADD_REQUEST = 'tatari/ACTIVE_ADD_REQUEST';
const ACTIVE_ADD_RESOLVE = 'tatari/ACTIVE_ADD_RESOLVE';
const activeAddReject = createAction(ACTIVE_ADD_REJECT);
const activeAddRequest = createAction(ACTIVE_ADD_REQUEST);
const activeAddResolve = createAction(ACTIVE_ADD_RESOLVE);
export const activeAdd = obj => async (dispatch) => {
  if (memo[obj.key] !== undefined) {
    const values = memo[obj.key].map((v) => { delete v.checked; return v; });

    dispatch(activeAddResolve({ key: obj.key, values }));
    return;
  }

  dispatch(activeAddRequest());
  dispatch(setLoading(obj.key, true));

  try {
    const { data } = await get(obj.endpoint);
    memo[obj.key] = data;
    if (data.length) { memo[obj.key].unshift('SELECTALL'); }

    dispatch(activeAddResolve({ key: obj.key, values: memo[obj.key] }));
  } catch (e) {
    dispatch(activeAddReject(e));
  }
};

const AVAILABLE_FETCH_REJECT = 'tatari/AVAILABLE_FETCH_REJECT';
const AVAILABLE_FETCH_REQUEST = 'tatari/AVAILABLE_FETCH_REQUEST';
const AVAILABLE_FETCH_RESOLVE = 'tatari/AVAILABLE_FETCH_RESOLVE';
const availableFetchReject = createAction(AVAILABLE_FETCH_REJECT);
const availableFetchRequest = createAction(AVAILABLE_FETCH_REQUEST);
const availableFetchResolve = createAction(AVAILABLE_FETCH_RESOLVE);
export const availableGet = url => async (dispatch) => {
  dispatch(availableFetchRequest());

  try {
    const { data } = await get(url);

    const result = Object.keys(data).map(key => ({
      endpoint: data[key],
      key,
      text: I18N[key],
    }));

    dispatch(availableFetchResolve(result));
  } catch (e) {
    dispatch(availableFetchReject(e));
  }
};

const HYDRATE_URL_REJECT = 'tatari/HYDRATE_URL_REJECT';
const HYDRATE_URL_REQUEST = 'tatari/HYDRATE_URL_REQUEST';
const HYDRATE_URL_RESOLVE = 'tatari/HYDRATE_URL_RESOLVE';
const hydrateUrlReject = createAction(HYDRATE_URL_REJECT);
const hydrateUrlRequest = createAction(HYDRATE_URL_REQUEST);
const hydrateUrlResolve = createAction(HYDRATE_URL_RESOLVE);
export const hydrateUrl = urls => async (dispatch) => {
  dispatch(hydrateUrlRequest());

  const url = window.location.href.split('?');
  const params = qs.parse(url[1]);
  const filters = params.filters;

  if (!filters) {
    try {
      const { data } = await get(urls.api.filters);
      params.filters = data;
      const newParams = qs.stringify(params, { arrayFormat: 'brackets' });

      history.pushState(
        history.state,
        '',
        `${urls.view.rfi}/list?${newParams}`,
      );
      dispatch(hydrateUrlResolve());
    } catch (e) {
      dispatch(hydrateUrlReject(e));
    }
  }
};

const INIT_REJECT = 'tatari/INIT_REJECT';
const INIT_REQUEST = 'tatari/INIT_REQUEST';
const INIT_RESOLVE = 'tatari/INIT_RESOLVE';
const initReject = createAction(INIT_REJECT);
const initRequest = createAction(INIT_REQUEST);
const initResolve = createAction(INIT_RESOLVE);
export const init = () => async (dispatch, getState) => {
  dispatch(initRequest());
  const url = window.location.href.split('?');
  const params = qs.parse(url[1]);

  if (!params || !params.filters) {
    dispatch(initResolve());
  } else {
    const filterData = availableFiltersSelector(getState()).reduce(
      (acc, v) => Object.assign(acc, { [v.key]: v }), {});

    Object.keys(params.filters).forEach(async (key) => {
      try {
        await dispatch(activeAdd(filterData[key]));
      } catch (e) {
        dispatch(initReject(e));
      }

      params.filters[key].forEach((v) => {
        dispatch(
          toggleCheckbox(
            { itemKey: v, evt: { target: { value: key, checked: true }}},
          ),
        );
      });

      delete params.filters[key];

      if (Object.keys(params.filters).length === 0) {
        dispatch(initResolve);
      }
    });
  }
};

const STORED_PATCH_REJECT = 'tatari/STORED_PATCH_REJECT';
const STORED_PATCH_REQUEST = 'tatari/STORED_PATCH_REQUEST';
const STORED_PATCH_RESOLVE = 'tatari/STORED_PATCH_RESOLVE';
const storedPatchReject = createAction(STORED_PATCH_REJECT);
const storedPatchRequest = createAction(STORED_PATCH_REQUEST);
const storedPatchResolve = createAction(STORED_PATCH_RESOLVE);
export const storedPatch = url => async (dispatch, getState) => {
  dispatch(storedPatchRequest());

  const payload = { filters: reduceAllFilters(getState)};

  if (Object.keys(payload.filters).length === 0) {
    return;
  }

  try {
    await patch(url, payload);
    dispatch(storedPatchResolve());
  } catch (e) {
    dispatch(storedPatchReject(e));
  }
};

export const updateUrl = () => (dispatch, getState) => {
  const url = window.location.href.split('?');
  const params = qs.parse(url[1]);
  params.filters = reduceAllFilters(getState);
  params.page = 1;

  const newParams = qs.stringify(params, { arrayFormat: 'brackets' });

  history.pushState(history.state, '', `${url[0]}?${newParams}`);
};

// ===== Reducer
const reducer = handleActions({
  [AVAILABLE_FETCH_RESOLVE]: (state, { payload: data }) =>
    state.set('availableFilters', data),

  [ACTIVE_ADD_RESOLVE]: (state, { payload: { key, values } }) => {
    return state
      .setIn(['activeFiltersCheckedCount', key], 0)
      .setIn(['activeFilters', key], values);
  },

  [ACTIVE_REMOVE_ONE]: (state, { payload: key }) =>
    state.deleteIn(['activeFilters', key]),

  [ACTIVE_REMOVE_ALL]: state =>
    state.set('activeFilters', Map()),

  [ACTIVE_REMOVE_EMPTY]: (state) => {
    const active = state.get('activeFiltersCheckedCount') || List();
    let newState = state;

    active.forEach((value, key) => {
      if (value === 0) {
        newState = newState.deleteIn(['activeFilters', key]);
      }
    });

    return newState;
  },

  [ACTIVE_SET_OPEN]: (state, { payload: { key } }) => {
    if (state.getIn(['isOpen', key]) === true) {
      return state;
    }

    return state.setIn(['isOpen', key], true);
  },

  [ACTIVE_SET_ALL_CLOSED]: state =>
    state.get('isOpen')
      ? state.set('isOpen', state.get('isOpen').map(() => false))
      : state,

  [TOGGLE_CHECKBOX]: (state, { payload: { itemKey, evt } }) => {
    const target = evt.target;
    const key = evt.target.value;

    const values = state.getIn(['activeFilters', key]);
    const index = values
      .findIndex(v => v.key && (v.key.toString() === itemKey.toString()));
    let count = state.getIn(['activeFiltersCheckedCount', key]) || 0;

    if (target.checked) {
      count += 1;
      values[index].checked = true;
    } else {
      count -= 1;
      delete values[index].checked;
    }

    return state
      .setIn(['activeFiltersCheckedCount', key], count)
      .setIn(['activeFilters', key], values);
  },

  [CHECK_ALL_CHECKBOXES]: (state, { payload: key }) => {
    const values = state.getIn(['activeFilters', key]);
    values.forEach(v => v === 'SELECTALL' ? null : v.checked = true);
    return state
      .setIn(['activeFiltersCheckedCount', key], values.length - 1)
      .setIn(['activeFilters', key], values);
  },

  [UNCHECK_ALL_CHECKBOXES]: (state, { payload: key }) => {
    const values = state.getIn(['activeFilters', key]);
    values.forEach(v => (v === 'SELECTALL' ? null : delete (v.checked)));
    return state
      .setIn(['activeFiltersCheckedCount', key], 0)
      .setIn(['activeFilters', key], values);
  },

  [SET_LOADING]: (state, { payload: { scope, value } }) =>
    state.setIn(['isLoading', scope], value),
}, Map());

export default reducer;
