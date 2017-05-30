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
      expanded: false,
      currentTier: 0
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.onBlur);
  }

  onCaretClick() {

  }

  onBlur = () => {
    this.setState({ expanded: false });
  }

  render() {
    const { data } = this.props;

    const items = [];

    return <div className={this.styles.container}>
      <div className={this.styles.tiers}>

      </div>

      <div className={this.styles.quickAdder}>
        <div className={this.styles.dropdownHead}>
          <input />
          <div className={this.styles.caret}>Caret</div>
          {/* <div>Check</div> */}
        </div>
        <div className={cx(this.styles.dropdownBody, { [this.styles.expanded]: this.state.expanded })}>
          {items}
        </div>
      </div>
    </div>
  }
}
