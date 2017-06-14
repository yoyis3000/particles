import React from 'react';

const manageModal = Component =>
  class ModalManager extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        marginTop: 0,
        marginLeft: 0,
        height: 0,
        innerHeight: 0
      };
    }

    onResize(payload) {
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

      this.setState({
        marginTop: - Math.floor(height / 2),
        marginLeft: - Math.floor(positionWidth / 2),
        height: Math.floor(height),
        innerHeight: Math.floor(innerHeight),
      });
    }

    render() {
      return (
        <Component
          {...this.props}
          resizeModal={this.onResize}
          marginTop={this.state.marginTop}
          marginLeft={this.state.marginLeft}
          height={this.state.height}
          innerHeight={this.state.innerHeight}
        />
      );
    }
  }

  export default manageModal;
