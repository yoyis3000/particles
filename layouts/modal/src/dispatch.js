import { resizeModal } from './reducer';

export default (dispatch, {scope}) => ({
  resizeModal: (payload) => dispatch(resizeModal({...payload, scope})),
});
