import React, { PropTypes } from 'react';
import cx from 'classnames';
import baseStyles from './Kaweake.scss';
import composeStyles from '../../../shared/stylesheetComposer';

export default class Kaweake extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    icon: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    selectedValue: PropTypes.string,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    textField: PropTypes.string,
    title: PropTypes.string.isRequired,
    valueField: PropTypes.string
  };

  static defaultProps = {
    data: [],
    icon: null,
    selectedValue: null,
    stylesheets: [],
    textField: 'text',
    valueField: 'value'
  };

  constructor(props) {
    super(props);
    this.styles = composeStyles(baseStyles, [...props.stylesheets]);
    this.state = { expanded: false };
  }

  componentWillMount() {
    window.addEventListener('click', this.onBlur);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onBlur);
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
      ? <img alt='' src={this.props.icon} className={this.styles.icon} />
      : null;

    const options = this.props.data.map(obj => (<div
      key={`option-${obj[this.props.valueField]}`}
      className={this.styles.option}
      data-value={obj[this.props.valueField]}
      onClick={this.onClick}
    >
      {obj[this.props.textField]}
    </div>));

    let titleText = this.props.title;

    if (this.props.selectedValue) {
      const element = this.props.data.find(({ value }) => value === this.props.selectedValue);

      if (element) {
        titleText = element.text;
      }
    }

    const title = (<span className={this.styles.title}>{titleText}</span>);

    const caret = (<div
      className={cx(this.styles.caret, 'fa', 'fa-caret-down',
      { [this.styles.expanded]: this.state.expanded })}
    />);

    return (<div className={cx(this.styles.container, { [this.styles.expanded]: this.state.expanded })}>
      <div className={this.styles.head} onClick={this.onFocus}>
        {img}
        {title}
        {caret}
      </div>
      <div className={this.styles.body}>
        {options}
      </div>
    </div>);
  }
}
