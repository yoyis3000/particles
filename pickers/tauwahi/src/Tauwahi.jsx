import React, { PropTypes } from 'react';
import cx from 'classnames';
import baseStyles from './Tauwahi.scss';
import composeStyles from '../../../shared/stylesheetComposer';

export default class Tauwahi extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()),
    // icon: PropTypes.string,
    // onSelect: PropTypes.func.isRequired,
    // selectedValue: PropTypes.string,
    // stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    // textField: PropTypes.string,
    // title: PropTypes.string.isRequired,
    // valueField: PropTypes.string
  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);
    this.styles = composeStyles(baseStyles, [...props.stylesheets]);

    const data = props.data.reduce((acc, v) => {
      // if (v.parent_id === null) {
      //   acc[parent_id] = {};
      // }

      return acc;
    }, {});

    this.state = {
      data,
      isExpanded: false,
      currentTier: 0
    }
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
    const { data } = this.props;
    const { isExpanded } = this.state;

    const items = [
      <div key={1} className={this.styles.item}>Mock 1</div>,
      <div key={2} className={this.styles.item}>Mock 2</div>,
      <div key={3} className={this.styles.item}>Mock 3</div>,
      <div key={4} className={this.styles.item}>Mock 4</div>,
      <div key={5} className={this.styles.item}>Mock 5</div>
    ];

    const caret = (<div className={this.styles.caret} onClick={this.onCaretClick}>
      <span
        className={cx('fa', 'fa-caret-down', this.styles.arrow,
        { [this.styles.expanded]: isExpanded })}
      />
    </div>);

    const check = (<div className={this.styles.check}>
      <span className={cx('fa', 'fa-check', this.styles.checkmark)} />
    </div>);

    return <div className={this.styles.container}>
      <div className={this.styles.tiers}>

      </div>

      <div className={this.styles.quickAdder}>
        <div className={this.styles.dropdownHead}>
          <input className={this.styles.input} />
          {caret}
          {check}
        </div>
        <div className={cx(this.styles.dropdownBody, { [this.styles.expanded]: isExpanded })}>
          {items}
        </div>
      </div>
    </div>
  }
}
