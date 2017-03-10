import React, { Component, PropTypes } from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Moment from 'moment';

import momentLocalizer from 'react-widgets/lib/localizers/moment';

import defaultStyles from './DatePicker.scss';

import composeStyles from '../../../../shared/stylesheetComposer';

let styles = {};

momentLocalizer(Moment);

export default class DatePicker extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    stylesheets: PropTypes.arrayOf(PropTypes.shape())
  }

  static defaultProps = {
    placeholder: 'mm/dd/yy',
    stylesheets: []
  }

  constructor(props) {
    super(props);

    styles = composeStyles(defaultStyles, props.stylesheets);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.rwOverrides}>
        <DateTimePicker placeholder={this.props.placeholder} time={false} />
      </div>
    );
  }
}
