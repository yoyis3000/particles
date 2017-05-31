import React, { PropTypes } from 'react';
import cx from 'classnames';
import baseStyles from './Tauwahi.scss';
import composeStyles from '../../../shared/stylesheetComposer';

const { arrayOf, shape } = PropTypes;

const group = (data) => {
  return data.reduce((acc, val) => {
    const key = val.parent_id || null;
    if (acc[key]) {
      acc[key].push(val);
      return acc;
    } else {
      return Object.assign(acc, { [key]: [val] });
    }
  }, { null: [] });
};

const getSelected = (names) => {

};

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
      data: group(props.data),
      isExpanded: false,
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
    const items = data[selected.id];
    const names = selected.full_name.split('>');

    const caret = (<div className={this.styles.caret} onClick={this.onCaretClick}>
      <span
        className={cx('fa', 'fa-caret-down', this.styles.arrow,
        { [this.styles.expanded]: isExpanded })}
      />
    </div>);

    const check = (<div className={this.styles.check}>
      <span className={cx('fa', 'fa-check', this.styles.checkmark)} />
    </div>);

    const remove = (<div className={this.styles.check}>
      <span className={cx('fa', 'fa-remove', this.styles.checkmark)} />
    </div>);

    return <div className={this.styles.container}>
      <div className={this.styles.tiers}>
        {names.map(name => (
          <div
            className={this.styles.tierLabel}
            onClick={() => this.setState({ selected: getSelected() })}
          >
            {name}</div>
        ))}
      </div>
      {items ? (
        <div className={this.styles.quickAdder}>
          <div className={this.styles.dropdownHead}>
            <input className={this.styles.input} />
            {caret}
            {check}
          </div>
          <div className={cx(this.styles.dropdownBody, { [this.styles.expanded]: isExpanded })}>
            {items.map(item => (
              <div
                key={item.id}
                className={this.styles.dropdownItem}
                onClick={() => this.setState({ selected: item })}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={this.styles.dropdownHead}>
          <input className={this.styles.input} placeholder='Add New Tier...' />
          {check}
        </div>
      )}
    </div>
  }
}
