import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

export const RESIZE_MODAL = 'modal/RESIZE_MODAL';

export const resizeModal = createAction(RESIZE_MODAL);

const reducer = handleActions({
  [RESIZE_MODAL]: (state, { payload }) => {
    const {
      bodyHeight,
      contentHeight,
      footerHeight,
      gutter,
      headerHeight,
      positionWidth,
      scope,
      windowHeight,
    } = payload;
    const startingHeight = bodyHeight ? bodyHeight : contentHeight;
    const computedHeight = startingHeight + footerHeight + headerHeight;

    // NOTE: gutter is the min gap in pixels you want from the screens edged to the modal
    const totalGutter = gutter * 2;
    const boundHeight = windowHeight - totalGutter;
    const boundInnerHeight = boundHeight - footerHeight - headerHeight;

    const inBound = boundHeight > computedHeight;
    let height = boundHeight;
    let innerHeight = boundInnerHeight;

    if (inBound) {
      height = computedHeight;
      innerHeight = startingHeight;
    }

    return state.mergeIn([scope], {
      marginTop: - Math.floor(height / 2),
      marginLeft: - Math.floor(positionWidth / 2),
      height: Math.floor(height),
      innerHeight: Math.floor(innerHeight),
    });
  },
}, Map());

export default reducer;
