import React, { PropTypes } from 'react';
import baseStyles from './Ripa.scss';
import defaultStyles from './RipaDefault.scss';
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
    slot: PropTypes.node,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    title: PropTypes.string
  };

  static defaultProps = {
    onChange: null,
    selectedKey: null,
    slot: null,
    stylesheets: [],
    title: null
  };

  constructor(props) {
    super(props);
    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);
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
      slot,
      title
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
        <div className={styles.title}>{title}</div>
        {tabs}
        <div className={styles.slot}>{slot}</div>
      </div>
    );
  }
}

export default Ripa;
