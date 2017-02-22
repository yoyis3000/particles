import { createSelector, createStructuredSelector } from 'reselect';
import { Map } from 'immutable';

const tatariSelector = state => state;

export const activeFiltersSelector = createSelector(
  tatariSelector,
  state => state.get('activeFilters', Map())
);

export const activeFiltersCheckedCountSelector = createSelector(
  tatariSelector,
  state => state.get('activeFiltersCheckedCount', Map())
);

export const availableFiltersSelector = createSelector(
  tatariSelector,
  state => state.get('availableFilters', [])
);

const isLoadingSelector = createSelector(
  tatariSelector,
  state => state.get('isLoading', Map({ tatari: true }))
);

const isOpenSelector = createSelector(
  tatariSelector,
  state => state.get('isOpen', Map())
);

export default createStructuredSelector({
  availableFilters: availableFiltersSelector,
  activeFilters: activeFiltersSelector,
  activeFiltersCheckedCount: activeFiltersCheckedCountSelector,
  isLoading: isLoadingSelector,
  isOpen: isOpenSelector,
});
