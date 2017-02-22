import { bindActionCreators } from 'redux';
import {
  activeAdd,
  activeRemoveOne,
  activeRemoveAll,
  activeRemoveEmpty,
  activeSetAllClosed,
  activeSetOpen,
  availableGet,
  checkAllCheckboxes,
  hydrateUrl,
  init,
  setLoading,
  storedPatch,
  toggleCheckbox,
  uncheckAllCheckboxes,
  updateUrl,
} from './TatariReducer';

export default (dispatch, { urls }) =>
  bindActionCreators({
    activeAdd,
    activeRemoveOne,
    activeRemoveAll,
    activeRemoveEmpty,
    activeSetAllClosed,
    activeSetOpen,
    availableGet: availableGet.bind(null, urls.api.filtersGet),
    checkAllCheckboxes,
    hydrateUrl: hydrateUrl.bind(null, urls),
    init,
    setLoading,
    storedPatch,
    toggleCheckbox,
    uncheckAllCheckboxes,
    updateUrl,
  }, dispatch);
