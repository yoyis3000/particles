import React from 'react';
import PropTypes from 'prop-types';
import baseStyles from './Ripa.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

class Ripa extends React.Component {
  static propTypes = {
    labels: PropTypes.arrayOf(
      PropTypes.shape({
        k: PropTypes.string,
        v: PropTypes.string
      }),
    ).isRequired,
    onChange: PropTypes.func,
    selectedKey: PropTypes.string,
    slotL: PropTypes.node,
    slotR: PropTypes.node,
    stylesheets: PropTypes.arrayOf(PropTypes.shape())
  };

  static defaultProps = {
    onChange: null,
    selectedKey: null,
    slotL: null,
    slotR: null,
    stylesheets: []
  };

  constructor(props) {
    super(props);
    styles = composeStyles(baseStyles, [...props.stylesheets]);
  }

  componentWillMount() {
    const { selectedKey, labels } = this.props;
    const selectedIndex = labels.reduce((acc, label, index) => {
      if (label.k === selectedKey) {
        return index;
      }

      return acc;
    }, -1);

    this.state = { selectedIndex };
  }

  onClickButton = ({ k, v, index }) => () => {
    this.setSelected({ k, v, index });
  }

  setSelected({ k, v, index }) {
    const { selectedIndex } = this.state;
    if (selectedIndex !== index) {
      this.setState({ selectedIndex: index });
      this.props.onChange(k, v, index);
    }
  }

  render() {
    const {
      labels,
      slotL,
      slotR
    } = this.props;

    const { selectedIndex } = this.state;

    const tabs = labels.map(({ k, v }, index) => (
      <div
        className={`${styles.tab} ${selectedIndex === index ? styles.active : null}`}
        key={`${k}-tab`}
        onClick={this.onClickButton({ k, v, index })}
      >
        {v}
      </div>
    ));

    return (
      <div className={styles.container}>
        <div className={styles.slotL}>{slotL}</div>
        {tabs}
        <div className={styles.slotR}>{slotR}</div>
      </div>
    );
  }
}

export default Ripa;
