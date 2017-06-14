import React from 'react';

const mountLock = Component => (
  class MountLockComponent extends React.Component {
    componentDidMount() {
      this.bodyNode = document.querySelector('body');
      this.lockScroll();
    }

    componentWillUnmount() {
      this.unlockScroll();
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

export default mountLock;
