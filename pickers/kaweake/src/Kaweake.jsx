import React, { PropTypes } from 'react';
import cx from 'classnames';
import baseStyles from './Kaweake.scss';
import defaultStyles from './KaweakeDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

export default class Kaweake extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    textField: PropTypes.string,
    valueField: PropTypes.string
  };

  static defaultProps = {
    icon: null,
    data: [],
    stylesheets: [],
    textField: 'text',
    valueField: 'value'
  };

  constructor(props) {
    super(props);
    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);
    this.state = { expanded: false };
  }

  componentWillMount() {
    window.addEventListener('click', this.onBlur);
  }

  onFocus = (evt) => {
    evt.stopPropagation();
    this.setState({ expanded: !this.state.expanded });
  }

  onBlur = () => {
    this.setState({ expanded: false });
  };

  onClick = (evt) => {
    this.props.onSelect(evt.target.dataset.value);
  }

  render() {
    const img = this.props.icon
      ? <img alt='' src={this.props.icon} className={styles.icon} />
      : null;

    const options = this.props.data.map(obj => (<div
      key={`option-${obj[this.props.valueField]}`}
      className={styles.option}
      data-value={obj[this.props.valueField]}
      onClick={this.onClick}
    >
      {obj[this.props.textField]}
    </div>));

    const title = (<span className={styles.title}>
      {this.props.title}
    </span>);

    const caret = (<div
      className={cx(styles.caret, 'fa', 'fa-caret-down',
      { [styles.expanded]: this.state.expanded })}
    />);

    return (<div className={cx(styles.container, { [styles.expanded]: this.state.expanded })}>
      <div className={styles.head} onClick={this.onFocus}>
        {img}
        {title}
        {caret}
      </div>
      <div className={styles.body}>
        {options}
      </div>
    </div>);
  }
}
