/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PropTypes } from 'react';
import { DropdownList } from 'react-widgets';

import styles from './Tatari.scss';
import TatariInterface from './TatariInterface';
import TatariCheckboxItem from './TatariCheckboxItem';
import TatariPlainItem from './TatariPlainItem';
import TatariClearAll from './TatariClearAll';
import TatariFilterHead from './TatariFilterHead';

@TatariInterface
export default class Tatari extends React.Component {
  static propTypes = {
    activeAdd: PropTypes.func,
    activeFilters: PropTypes.shape(),
    activeFiltersCheckedCount: PropTypes.shape(),
    activeRemoveAll: PropTypes.func,
    activeRemoveEmpty: PropTypes.func,
    activeRemoveOne: PropTypes.func,
    activeSetAllClosed: PropTypes.func,
    activeSetOpen: PropTypes.func,
    availableFilters: PropTypes.arrayOf(PropTypes.shape()),
    availableGet: PropTypes.func,
    callback: PropTypes.func,
    checkAllCheckboxes: PropTypes.func,
    hydrateUrl: PropTypes.func,
    init: PropTypes.func,
    isOpen: PropTypes.shape(),
    onChange: PropTypes.func,
    storedPatch: PropTypes.func,
    toggleCheckbox: PropTypes.func,
    uncheckAllCheckboxes: PropTypes.func,
    updateUrl: PropTypes.func,
  }

  componentWillMount() {
    const {
      availableGet,
      callback,
      hydrateUrl,
      init,
    } = this.props;

    try {
      hydrateUrl()
      .then(availableGet)
      .then(init)
      .then(callback);
    } catch (e) {
      console.error(e); // eslint-disable-line
    }

    window.addEventListener('click', this.blurHandler);
  }

  onAvailableClick = (evt) => {
    evt.stopPropagation();
  }

  onClearAllClick = () => {
    this.props.activeRemoveAll();
    this.props.updateUrl();
    this.props.onChange();
  }

  onAvailableChange = (item) => {
    this.props.activeAdd(item);
    this.props.activeSetOpen({ key: item.key });
  }

  onAvailableToggle = (isExpanded) => {
    if (isExpanded) {
      this.props.activeSetAllClosed();
      this.props.activeRemoveEmpty();
    }
  }

  expandActiveFilter = key => (evt) => {
    evt.stopPropagation();

    if (this.props.isOpen.get(key) !== true) {
      this.props.activeSetOpen({ key });
    }
  }

  blurHandler = () => {
    const {
      activeRemoveEmpty,
      activeSetAllClosed,
      isOpen,
      onChange,
      storedPatch,
      persistenceUrl,
    } = this.props;

    const openFilters = isOpen
      .reduce((acc, v) => { return (v ? acc + 1 : acc); }, 0);

    if (openFilters > 0) {
      activeRemoveEmpty();
      activeSetAllClosed();
      storedPatch(persistenceUrl);
      onChange();
    }
  }

  itemRenderer = (key) => {
    const {
      checkAllCheckboxes,
      toggleCheckbox,
      uncheckAllCheckboxes,
      updateUrl,
    } = this.props;

    return TatariCheckboxItem.bind(null, {
      checkAllCheckboxes,
      key,
      toggleCheckbox,
      uncheckAllCheckboxes,
      updateUrl,
    });
  }

  headRenderer = (key) => {
    const {
      availableFilters,
      activeFiltersCheckedCount,
      activeRemoveOne,
      onChange,
      updateUrl,
    } = this.props;

    const currentFilter = availableFilters.find(obj => obj.key === key);

    const onRemove = () => {
      activeRemoveOne(currentFilter.key);
      updateUrl();
      onChange();
    };

    return TatariFilterHead.bind(null,
      onRemove,
      currentFilter.text,
      activeFiltersCheckedCount.get(key),
    );
  }

  render() {
    const {
      activeFilters,
      availableFilters,
      isOpen,
    } = this.props;

    const bank = activeFilters.toJS();
    const bankKeys = Object.keys(bank);

    const availableFiltersWithoutActive = availableFilters
      .filter(obj => bankKeys.indexOf(obj.key) === -1);

    const availableFiltersIfAny = availableFiltersWithoutActive.length
      ? (<div className={styles.dropdown} onClick={this.onAvailableClick}>
        <DropdownList
          data={availableFiltersWithoutActive}
          itemComponent={TatariPlainItem}
          onToggle={this.onAvailableToggle}
          onChange={this.onAvailableChange}
          value="Add Filter"
          textField="text"
          valueField="endpoint"
        />
      </div>)
      : null;

    const currentFilters = Object.keys(bank).map((key) => {
      return (
        <div
          key={key}
          className={styles.dropdown}
          onClick={this.expandActiveFilter(key)}
          ref={div => (this[key] = div)}
        >
          <DropdownList
            data={bank[key]}
            filter="contains"
            valueComponent={this.headRenderer(key)}
            itemComponent={this.itemRenderer(key)}
            onToggle={this.onAvailableToggle}
            open={isOpen.get(key)}
            textField="value"
            valueField="key"
          />
        </div>
      );
    });

    const clearAll = currentFilters.length
      ? <TatariClearAll onClick={this.onClearAllClick} />
      : null;

    return (
      <div>
        {currentFilters}
        {availableFiltersIfAny}
        {clearAll}
      </div>
    );
  }
}
