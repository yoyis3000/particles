import React from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';
import baseStyles from './Tukuatu.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

function kill(evt) {
  evt.preventDefault();
  evt.stopPropagation();
}

export default class Tukuatu extends React.Component {
  static propTypes = {
    onComplete: PropTypes.func.isRequired,
    slotAttach: PropTypes.element,
    slotDrag: PropTypes.element,
    stylesheets: PropTypes.arrayOf(PropTypes.shape())
  };

  static defaultProps = {
    slotDrag: <div>Drag and Drop File(s)</div>,
    slotAttach: <div>Attach File(s)</div>,
    stylesheets: []
  };

  constructor(props) {
    super(props);
    styles = composeStyles(baseStyles, [...props.stylesheets]);
    this.state = { hover: false };
  }

  onAttach = (evt) => {
    const files = evt.target.files || evt.dataTransfer.files;
    this.props.onComplete([...files]);
  }

  onDragOver = (evt) => {
    kill(evt);
    this.setState({ hover: true });
  }

  onDragLeave = () => {
    this.setState({ hover: false });
  }

  onDrop = (evt) => {
    kill(evt);

    this.setState({ hover: false });

    const files = evt.target.files || evt.dataTransfer.files;
    this.props.onComplete([...files]);
  }

  render() {
    return (<div className={styles.container}>
      <label className={styles.slotAttach}>
        <input type='file' multiple='multiple' className={styles.fileInput} onChange={this.onAttach} />
        {this.props.slotAttach}
      </label>
      <div
        className={`${styles.slotDrag} ${this.state.hover ? styles.dragHover : ''}`}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {this.props.slotDrag}
      </div>
    </div>);
  }
}
