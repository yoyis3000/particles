import React, { PropTypes } from 'react';

const CreateModalContext = (Component) => {
  return class ModalComponent extends React.Component {
    static contextTypes = {
      modal: PropTypes.shape({
        getHeight: PropTypes.func,
      }),
    }

    constructor(props) {
      super(props);
      this.state = {
        height: 0,
      };
    }

    componentDidUpdate() {
      const height = this.context.modal.getHeight();
      if (this.state.height !== height) {
        this.setState({ height });
      }
    }

    render() {
      return (
        <Component
          height={this.state.height}
          {...this.props}
        />
      );
    }
  };
};

const SplitPane = ({ topPane, leftPane, rightPane, height }) => {
  let topPaneHeight = 0;
  if (topPane) {
    topPaneHeight = 70;
  }
  let bodyHeight = height - topPaneHeight;
  if (bodyHeight < 0) {
    bodyHeight = 380;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ width: '100%', height: topPaneHeight }}>
        {topPane}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: bodyHeight,
        }}
      >
        <div
          style={{
            display: 'flex',
            overflowY: 'scroll',
            paddingRight: '20px',
            width: '30%',
          }}
        >
          {leftPane}
        </div>
        <div
          style={{
            display: 'flex',
            padding: '0 20px',
            width: '70%',
            overflowY: 'scroll',
          }}
        >
          {rightPane}
        </div>
      </div>
    </div>
  );
};

SplitPane.propTypes = {
  topPane: PropTypes.node,
  leftPane: PropTypes.node,
  rightPane: PropTypes.node,
  height: PropTypes.number,
};

SplitPane.defaultProps = {
  height: 450,
};

export default SplitPane;
export const ModalSplitPane = CreateModalContext(SplitPane);
