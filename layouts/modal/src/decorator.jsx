import React from 'react';

function windowResize(Component) {
  return class WindowResizeComponent extends React.Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      const { resize: { onResize }} = this.refs;
      window.addEventListener('resize', onResize);
      onResize();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.refs.resize.onResize);
    }

    render() {
      return <Component ref="resize" {...this.props} />;
    }

  };
}

export default windowResize;
