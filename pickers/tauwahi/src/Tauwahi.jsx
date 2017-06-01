import React, { PropTypes } from 'react';
import cx from 'classnames';
import baseStyles from './Tauwahi.scss';
import composeStyles from '../../../shared/stylesheetComposer';

const { arrayOf, shape } = PropTypes;

function group(data) {
  return data.reduce((acc, val) => {
    const key = val.parent_id || null;
    if (acc[key]) {
      acc[key].push(val);
      return acc;
    } else {
      return Object.assign(acc, { [key]: [val] });
    }
  }, { null: [] });
}

function getSelected(names, index, data) {
  const name = names.splice(0, index + 1).join('>');
  return data.find(d => d.full_name === name);
}

export default class Tauwahi extends React.Component {
  static propTypes = {
    data: arrayOf(shape()),
    stylesheets: arrayOf(shape())
  };

  static defaultProps = {
    data: [],
    stylesheets: []
  };

  constructor(props) {
    super(props);
    this.styles = composeStyles(baseStyles, [...props.stylesheets]);

    this.state = {
      data: props.data,
      isExpanded: true,
      currentTier: 0,
      selected: { id: null, full_name: '' }
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.onBlur);
  }

  onCaretClick = (evt) => {
    evt.stopPropagation();
    this.setState({ isExpanded: true });
  }

  onBlur = () => {
    this.setState({ isExpanded: false });
  }

  render() {
    const { data, isExpanded, selected } = this.state;
    const grouped = group(data);

    const items = grouped[selected.id] ? grouped[selected.id].map(item => (
      <div
        key={item.id}
        className={this.styles.dropdownItem}
        onClick={() => this.setState({ selected: item })}
      >
        {item.name}
      </div>
    )) : [];

    const names = selected.full_name ? selected.full_name.split('>') : [];
    const tierLabels = names.map((name, index) => (
      <div
        className={this.styles.tierLabel}
        onClick={() => this.setState({
          selected: getSelected(names, index, data)
        })}
      >
        <div className={this.styles.tierNumber}>Tier X</div>
        <div className={this.styles.tierValue}>{name}</div>
      </div>
    ));

    const caret = (<div className={this.styles.caret} onClick={this.onCaretClick}>
      <span
        className={cx('fa', 'fa-caret-down', this.styles.arrow,
        { [this.styles.expanded]: true })}
      />
    </div>);

    const check = (<div className={this.styles.check}>
      <span className={cx('fa', 'fa-check', this.styles.checkmark)} />
    </div>);

    const addButton = <button className={this.styles.quickAdd}>Add New Tier...</button>

    return <div className={this.styles.container}>
      <div className={this.styles.tiers}>
        {tierLabels}
      </div>

      <div className={this.styles.dropdownHead}>
        <input className={this.styles.input} />
        {caret}
        {check}
      </div>

      <div className={cx(this.styles.dropdownBody, { [this.styles.expanded]: isExpanded })}>
        {items}
        {addButton}
      </div>
    </div>
  }
}
