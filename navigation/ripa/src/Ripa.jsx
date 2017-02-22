import React, { PropTypes } from 'react';
import styles from './Ripa.scss';

class Ripa extends React.Component {

  componentWillMount() {
    const { selectedKey, labels } = this.props;
    const selectedIndex = labels.findIndex(l => l.k === selectedKey);
    this.state = { selectedIndex };
  }

  setSelected({ k, v, index }) {
    const { selectedIndex } = this.state;
    if (selectedIndex !== index) {
      this.setState({ selectedIndex: index });
      this.props.onChange(k, v, index);
    }
  }

  _onClickButton = ({ k, v, index }) => () => {
    this.setSelected({ k, v, index });
  };

  render() {
    const {
      labels,
      slot,
      title,
    } = this.props;

    const { selectedIndex } = this.state;

    const tabs = labels.map(({ k, v }, index) => (
      <button
        className={`${styles.tab} ${selectedIndex === index ? styles.active : null}`}
        key={`${k}-tab`}
        onClick={this._onClickButton({ k, v, index })}
      >
        {v}
      </button>
    ));

    return (
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        {tabs}
        <div className={styles.slot}>{slot}</div>
      </div>
    );
  }
}

Ripa.propTypes = {
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      k: PropTypes.string,
      v: PropTypes.string,
    }),
  ).isRequired,
  onChange: PropTypes.func,
  selectedKey: PropTypes.string,
  slot: PropTypes.node,
  title: PropTypes.string,
};

Ripa.defaultProps = {
  selectedKey: null,
  onChange: null,
  slot: null,
  title: null,
};


export default Ripa;
