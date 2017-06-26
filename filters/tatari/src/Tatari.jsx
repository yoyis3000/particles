import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { get, patch, destroy } from './TatariApi';
import TatariDropdownPlain from './TatariDropdownPlain';
import TatariDropdownCheckboxes from './TatariDropdownCheckboxes';

import baseStyles from './Tatari.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

export default class Tatari extends React.Component {
  static propTypes = {
    filterOptions: PropTypes.func,
    i18n: PropTypes.shape(),
    onComplete: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    urls: PropTypes.shape({
      available: PropTypes.string.isRequired,
      patch: PropTypes.string,
      saved: PropTypes.string,
      delete: PropTypes.string
    }).isRequired
  }

  static defaultProps = {
    filterOptions: item => item,
    i18n: {},
    stylesheets: []
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [...props.stylesheets]);

    this.state = {
      activeFilters: [],
      expanded: {},
      hiding: {},
      inactiveFilters: [],
      loading: {},
      options: {},
      savedFilters: [],
      savedSelections: []
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.onBlur);

    Promise.all([
      get(this.props.urls.available),
      get(this.props.urls.saved)
    ])
    .then(([{ data: filterData }, { data: stored }]) => {
      let saved = stored;

      const savedFilters = Object.keys(saved);

      const savedSelections = Object.keys(saved)
        .reduce((acc, key) => acc.concat(saved[key] || []), []);

      savedFilters.push(...savedSelections);

      this.setState({ savedFilters, savedSelections });

      // This is only needed for backwards compatibility, will remove in the near future
      // -- May the Fourth Be With You (2017)
      if (Array.isArray(saved)) {
        saved =
          stored.reduce((acc, item) => Object.assign(acc, { [item.key]: item.storedValue }), {});
      }

      const url = window.location.href.split('?');
      const params = qs.parse(url[1]);
      const previousFilters = params.filters || saved;
      const availableFilters = this.props.filterOptions(filterData);

      const activeFilters = availableFilters.reduce((acc, filter, index) => {
        if (previousFilters[filter.key] !== undefined && previousFilters[filter.key] !== null) {
          acc.push(Object.assign(filter, { index }));
        }

        return acc;
      }, []);

      const inactiveFilters = availableFilters.reduce((acc, filter, index) => {
        if (previousFilters[filter.key] === undefined || previousFilters[filter.key] === null) {
          acc.push(Object.assign(filter, { index }));
        }

        return acc;
      }, []);


      const loading = availableFilters.reduce((acc, filter) =>
        Object.assign(acc, { [filter.key]: previousFilters[filter.key] !== undefined }),
        {});

      this.setState({ inactiveFilters, activeFilters, loading });

      Promise.all(activeFilters.map(filter => get(filter.endpoint)))
        .then((values) => {
          const options = activeFilters.reduce((acc, filter, index) => {
            const { data } = values[index];

            const setChecked = d => Object.assign(d, { checked: (
              previousFilters[filter.key]
                .filter(v => (v && v.toString()) === d.key.toString())
                .length > 0
            ) });

            return Object.assign(acc, { [filter.key]: data.map(setChecked) });
          }, {});

          this.setState({ options, loading: {} }, () => {
            this.updateUrl();
            this.props.onComplete();
          });
        });
    })
    .catch(e => { console.error(e); }) // eslint-disable-line
  }

  onExpand = (evt) => {
    evt.stopPropagation();
    const key = evt.currentTarget.dataset.key;
    if (this.state.loading[key]) {
      return;
    }

    const expandedStatus = !this.state.expanded[key];

    if (expandedStatus === false && key !== 'inactive') {
      this.onBlur();
    }

    const expanded = { [key]: expandedStatus };

    this.setState({ expanded });
  }

  onBlur = () => {
    const activeExpandedCount = this.state.activeFilters.reduce((acc, filter) =>
      (this.state.expanded[filter.key] === true ? acc + 1 : acc), 0);

    if (activeExpandedCount) {
      this.updateUrl();
      this.removeEmptyActive();
      this.saveOptions();
    }

    this.setState({ expanded: {} });
  }

  onSearch = (evt) => {
    evt.stopPropagation();

    const value = evt.target.value.toLowerCase();
    const key = evt.target.dataset.key;

    const options = this.state.options;

    const filteredOptions = options[key].map(option => Object.assign(option,
      { hidden: (option.value.toLowerCase().indexOf(value) === -1) }));

    options[key] = filteredOptions;

    this.setState({ options });
  }

  updateUrl = () => {
    const url = window.location.href.split('?');
    const params = qs.parse(url[1]);
    params.filters = this.createPayload();
    params.page = 1;

    const newParams = qs.stringify(params, { arrayFormat: 'brackets' });

    history.pushState(history.state, '', `${url[0]}?${newParams}`);
  };

  createPayload = () => {
    const { activeFilters, options } = this.state;

    const reduceSingle = (acc, value) => {
      if (value.key && value.checked === true) {
        acc.push(value.key);
      }

      return acc;
    };

    const reduceAll = (acc, filter) =>
      Object.assign(acc, { [filter.key]: options[filter.key].reduce(reduceSingle, []) });

    return activeFilters.reduce(reduceAll, {});
  }

  saveOptions = () => {
    if (!this.props.urls.patch) {
      this.props.onComplete();
      return;
    }

    const payload = { filters: this.createPayload() };

    const { savedFilters } = this.state;
    const newFilters = Object.keys(payload.filters);
    const newSelections = Object.keys(payload.filters).reduce((acc, key) => {
      acc.push(...payload.filters[key]);
      return acc;
    }, []);

    newFilters.push(...newSelections);

    const isFiltersSame = newFilters.reduce((acc, key) => acc && savedFilters.includes(key), true);
    const isFiltersSameLength = savedFilters.length === newFilters.length;

    if (!(isFiltersSame && isFiltersSameLength)) {
      if (Object.keys(payload.filters).length) {
        patch(this.props.urls.patch, payload).then(this.props.onComplete);
      } else {
        destroy(this.props.urls.delete).then(this.props.onComplete);
      }
      this.setState({ savedFilters: newFilters, savedSelections: newSelections });
    }
  }

  checkOne = (evt) => {
    evt.stopPropagation();

    const { options } = this.state;
    const key = evt.currentTarget.dataset.key;
    const filterKey = evt.currentTarget.dataset.filterKey;

    options[filterKey] = options[filterKey].reduce((acc, option) => {
      option.key.toString() === key
        ? acc.push(Object.assign(option, { checked: !option.checked }))
        : acc.push(option);

      return acc;
    }, []);

    this.setState({
      options,
      expanded: Object.assign(this.state.expanded, { [filterKey]: true })
    });
  }

  checkAll = (evt) => {
    evt.stopPropagation();

    const key = evt.target.dataset.key;
    const { options } = this.state;

    options[key].reduce((acc, option) => {
      if (option.hidden === true) {
        return acc;
      }

      return acc.concat(Object.assign(option, { checked: true }));
    }, []);

    this.setState({ options });
  }

  checkNone = (evt) => {
    evt.stopPropagation();

    const key = evt.target.dataset.key;
    const options = this.state.options;

    options[key].reduce((acc, option) =>
      Object.assign(option, { checked: false }), []);

    this.setState({ options });
  }

  addActive = (evt) => {
    evt.stopPropagation();

    const { activeFilters, inactiveFilters, loading, options } = this.state;

    const key = evt.target.dataset.key;
    const index = inactiveFilters.findIndex(filter => filter.key === key);
    const item = inactiveFilters[index];

    loading[key] = true;
    inactiveFilters.splice(index, 1);
    activeFilters.push(item);

    const retrieveOptions = () => {
      if (options[key] === undefined) {
        return get(item.endpoint);
      }

      return Promise.resolve({ data: options[key] });
    };

    retrieveOptions().then(({ data }) => {
      options[key] = data.map(d => Object.assign(d, { checked: false, hidden: false }));
      const newLoading = this.state.loading;
      newLoading[key] = false;

      const newExpanded = this.state.expanded;
      newExpanded[key] = true;

      this.setState({ options, loading: newLoading, expanded: newExpanded });
    });

    this.setState({ inactiveFilters, activeFilters, loading, expanded: {} });
  }

  removeActive = (evt) => {
    evt.stopPropagation();

    const { activeFilters, inactiveFilters } = this.state;
    const key = evt.target.dataset.key;

    const index = activeFilters.findIndex(filter => filter.key === key);
    const item = activeFilters[index];

    activeFilters.splice(index, 1);
    inactiveFilters.push(item);
    inactiveFilters.sort((a, b) => (a.index - b.index));

    this.setState({ inactiveFilters, activeFilters }, () => {
      this.updateUrl();
      this.saveOptions();
    });
  }

  removeAllActive = () => {
    const { activeFilters, inactiveFilters } = this.state;
    const inactive = inactiveFilters.concat(activeFilters)
      .sort((a, b) => (a.index - b.index));

    this.setState({ inactiveFilters: inactive, activeFilters: [] }, () => {
      this.updateUrl();
      this.saveOptions();
    });
  }

  removeEmptyActive = () => {
    const { activeFilters, inactiveFilters } = this.state;

    const activeUpdated = activeFilters.reduce((activeAcc, filter) => {
      const isPopulated = this.state.options[filter.key]
        .reduce((acc, option) => acc || option.checked, false);

      if (isPopulated === false) {
        inactiveFilters.push(filter);
      } else {
        activeAcc.push(filter);
      }

      return activeAcc;
    }, []);

    inactiveFilters.sort((a, b) => (a.index - b.index));

    this.setState({
      activeFilters: activeUpdated,
      inactiveFilters
    });
  }

  render() {
    const inactiveFilters = this.state.inactiveFilters.length
      ? (<TatariDropdownPlain
        data={this.state.inactiveFilters}
        i18n={this.props.i18n}
        isExpanded={this.state.expanded.inactive}
        isLoading={this.state.loading.inactive}
        onChange={this.addActive}
        onExpand={this.onExpand}
        styles={styles}
      />)
      : null;

    const activeFilters = this.state.activeFilters
      .map(item => <TatariDropdownCheckboxes
        key={`active-${item.key}`}
        filter={item}
        i18n={this.props.i18n}
        isExpanded={this.state.expanded[item.key]}
        isHiding={this.state.hiding[item.key]}
        isLoading={this.state.loading[item.key]}
        onCheckOne={this.checkOne}
        onCheckAll={this.checkAll}
        onCheckNone={this.checkNone}
        onExpand={this.onExpand}
        onRemove={this.removeActive}
        onSearch={this.onSearch}
        options={this.state.options[item.key]}
        styles={styles}
      />);

    const clearAll = (activeFilters.length
      ? (<div
        onClick={this.removeAllActive}
        className={styles.clearAllFilters}
      >
        {this.props.i18n.clear_all}
      </div>)
      : null);

    return (
      <div className={styles.filterContainer}>
        {activeFilters}
        {inactiveFilters}
        {clearAll}
      </div>
    );
  }
}
