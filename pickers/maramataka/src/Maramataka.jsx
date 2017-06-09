import React, { PropTypes } from 'react';
import cx from 'classnames';
import baseStyles from './Maramataka.scss';
import composeStyles from '../../../shared/stylesheetComposer';
import generateId from '../../../shared/generateId';

export default class Maramataka extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    value: PropTypes.shape()
  };

  static defaultProps = {
    stylesheets: [],
    value: { day: null, month: null, year: null }
  };

  constructor(props) {
    super(props);

    this.styles = composeStyles(baseStyles, [...props.stylesheets]);
    this.guid = generateId();

    const d = new Date();

    this.state = {
      active: { day: d.getDate(), month: d.getMonth(), year: d.getFullYear() },
      days: { previous: [], active: [], next: [] },
      errors: { day: false, month: false, year: false },
      expanded: true,
      selected: { day: null, month: null, year: null },
      value: props.value
    };
  }

  componentWillMount() {
    this.onInputChange();
    window.addEventListener('click', this.onBlur);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onBlur);
  }

  onBlur = () => {
    const expanded = (this.state.guid === this.guid);
    this.setState({ expanded, guid: null });
  }

  onHeadClick = () => {
    this.setState({ expanded: true, guid: this.guid });
  }

  onLeftArrowClick = (evt) => {
    evt.stopPropagation();

    const { active } = this.state;

    if (active.month === 0) {
      active.month = 11;
      active.year -= 1;
    } else {
      active.month -= 1;
    }

    this.setState({ active }, this.updateDateArrays);
  }

  onRightArrowClick = (evt) => {
    evt.stopPropagation();

    const { active } = this.state;

    if (active.month === 11) {
      active.month = 0;
      active.year += 1;
    } else {
      active.month += 1;
    }

    this.setState({ active }, this.updateDateArrays);
  }

  onDayClick = (evt) => {
    evt.stopPropagation();

    const target = evt.currentTarget;

    let { day, month, year } = target.dataset;

    day *= 1;
    month *= 1;
    year *= 1;

    if (month === 12) {
      month = 0;
      year += 1;
    } else if (month === -1) {
      month = 11;
      year -= 1;
    }

    const selected = { day, month, year };
    const value = { day, month: month + 1, year };

    this.setState({ selected, value }, () => {
      this.updateDateArrays();
      this.props.onSelect(value);
    });
  }

  onInputDay = (evt) => {
    const { value } = this.state;
    value.day = evt.target.value * 1;
    this.setState({ value }, this.onInputChange);
  }

  onInputMonth = (evt) => {
    const { value } = this.state;
    value.month = evt.target.value * 1;
    this.setState({ value }, this.onInputChange);
  }

  onInputYear = (evt) => {
    const { value } = this.state;
    value.year = evt.target.value * 1;
    this.setState({ value }, this.onInputChange);
  }

  onInputChange = () => {
    const { errors, value } = this.state;
    let { active, selected } = this.state;

    errors.day = !this.validateDay(value.day);
    errors.month = !this.validateMonth(value.month);
    errors.year = !this.validateYear(value.year);

    const valueIsValid =
      (errors.day === false && errors.month === false && errors.year === false);

    const valueIsEmpty =
      (value.day === 0 && value.month === 0 && value.year === 0);

    if (valueIsEmpty) {
      errors.day = false;
      errors.month = false;
      errors.year = false;
    } else if (valueIsValid && !valueIsEmpty) {
      selected = { day: value.day, month: value.month - 1, year: value.year };
      active = { day: value.day, month: value.month - 1, year: value.year };
    } else {
      selected = { day: null, month: null, year: null };
    }

    this.setState({ active, errors, selected, value }, this.updateDateArrays);
  }

  validateDay = (day) => {
    if (day === null) {
      return true;
    }

    const { active } = this.state;
    const daysInActiveMonth = new Date(active.year, active.month + 1, 0).getDate();

    if (day < 1 || day > daysInActiveMonth) {
      return false;
    }

    return true;
  }

  validateMonth = (month) => {
    if (month === null) {
      return true;
    }

    if (month < 1 || month > 12) {
      return false;
    }

    return true;
  }

  validateYear = (year) => {
    if (year === null) {
      return true;
    }

    return true;
  }

  updateDateArrays() {
    const { year, month } = this.state.active;

    const daysInPreviousMonth = new Date(year, month, 0).getDate();
    const daysInActiveMonth = new Date(year, month + 1, 0).getDate();

    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month, daysInActiveMonth);

    const firstSunday = new Date(year, month, 1 - firstDate.getDay());
    const lastSaturday = new Date(year, month, daysInActiveMonth + (6 - lastDate.getDay()));

    const previous = [];
    const active = [];
    const next = [];

    if (firstSunday.getDate() > 7) {
      for (let i = firstSunday.getDate(); i <= daysInPreviousMonth; i += 1) {
        previous.push(i);
      }
    }

    for (let i = 1; i <= daysInActiveMonth; i += 1) {
      active.push(i);
    }

    if (lastSaturday.getDate() < 7) {
      for (let i = 1; i <= lastSaturday.getDate(); i += 1) {
        next.push(i);
      }
    }

    this.setState({ days: { previous, active, next } });
  }

  renderHead() {
    const { errors } = this.state;

    return (<div className={this.styles.head} onClick={this.onHeadClick}>
      <input
        className={cx(this.styles.input, { [this.styles.invalid]: errors.month })}
        placeholder='mm'
        onFocus={this.onInputFocus}
        onChange={this.onInputMonth}
        value={this.state.value.month || null}
      />

      <span className={this.styles.slash}>/</span>

      <input
        className={cx(this.styles.input, { [this.styles.invalid]: errors.day })}
        placeholder='dd'
        onFocus={this.onInputFocus}
        onChange={this.onInputDay}
        value={this.state.value.day || null}
      />

      <span className={this.styles.slash}>/</span>

      <input
        className={cx(this.styles.input, this.styles.inputYear,
          { [this.styles.invalid]: errors.year })}
        placeholder='yyyy'
        onFocus={this.onInputFocus}
        onChange={this.onInputYear}
        value={this.state.value.year || null}
      />
    </div>);
  }

  renderDays() {
    const { active, days, selected } = this.state;

    const result = [];

    days.previous.forEach((day) => {
      const isSelected = (day === selected.day &&
        active.month === (selected.month + 1) &&
        active.year === selected.year);

      result.push(<div
        className={cx(this.styles.dayPrevious, { [this.styles.selected]: isSelected })}
        data-day={day}
        data-month={active.month - 1}
        data-year={active.year}
        key={`prev-${day}`}
        onClick={this.onDayClick}
      >
        {day}
      </div>);
    });

    days.active.forEach((day) => {
      const isSelected = (day === selected.day &&
        active.month === selected.month &&
        active.year === selected.year);

      result.push(<div
        className={cx(this.styles.dayActive, { [this.styles.selected]: isSelected })}
        data-day={day}
        data-month={active.month}
        data-year={active.year}
        key={`active-${day}`}
        onClick={this.onDayClick}
      >
        {day}
      </div>);
    });

    days.next.forEach((day) => {
      const isSelected = (day === selected.day &&
        active.month === (selected.month - 1) &&
        active.year === selected.year);

      result.push(<div
        className={cx(this.styles.dayNext, { [this.styles.selected]: isSelected })}
        data-day={day}
        data-month={active.month + 1}
        data-year={active.year}
        key={`next-${day}`}
        onClick={this.onDayClick}
      >
        {day}
      </div>);
    });

    return result;
  }

  render() {
    const { active, expanded } = this.state;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const head = this.renderHead();

    const days = this.renderDays();

    const dayTitles = dayNames.map(name =>
      <div key={`daytitle-${name}`} className={this.styles.dayTitle}>{name.substr(0, 2)}</div>
    );

    return (<div className={this.styles.container}>
      {head}

      <div className={this.styles.dropdownContainer}>
        <div
          className={cx(this.styles.dropdown, {
            [this.styles.expanded]: expanded })}
        >
          <div className={this.styles.month}>
            <div className={this.styles.leftArrow} onClick={this.onLeftArrowClick} />
            <div className={this.styles.monthTitle}>{monthNames[active.month]} {active.year}</div>
            <div className={this.styles.rightArrow} onClick={this.onRightArrowClick} />
          </div>

          <div className={this.styles.days}>
            {dayTitles}
            {days}
          </div>
        </div>
      </div>
    </div>);
  }
}
