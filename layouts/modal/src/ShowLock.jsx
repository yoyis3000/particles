import React, { PropTypes } from 'react';

const showLock = Component => (
  class ShowLockComponent extends React.Component {
    componentDidMount() {
      this.bodyNode = document.querySelector('body');
    }

    componentWillReceiveProps(nextProps) {
      if (!this.props.show && nextProps.show) {
        this.lockScroll();
      } else if (this.props.show && !nextProps.show) {
        this.unlockScroll();
      }
    }

    lockScroll() {
      const classes = this.bodyNode.className.split(' ');
      const lockClass = 'scroll-hidden';
      this.bodyNode.className = classes.concat(lockClass).join(' ');
    }

    unlockScroll() {
      const classes = this.bodyNode.className.split(' ');
      const index = this.indexOfLockClass(classes);
      if (index > -1) {
        classes.splice(index, 1);
        this.bodyNode.className = classes.join(' ');
      }
    }

    indexOfLockClass(classes) {
      const lockClass = 'scroll-hidden';
      return classes.indexOf(lockClass);
    }

    render() {
      return <Component {...this.props} />;
    }
  }
);

export default showLock;
