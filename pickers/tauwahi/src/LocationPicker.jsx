import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';
import { equals } from 'ramda';
import { locationPickerSelector } from 'redux/selectors/location';
import locationMapDispatch from 'redux/dispatch/location';
import getLocationStatusMessage from '../utils/getLocationStatusMessage';
import { formatNullOrValue } from '../../../utils/dataUtils';
import QuickAdder from 'components/QuickAdder';
import { OverlayTrigger, Tooltip} from 'react-bootstrap';
import { is, Map } from 'immutable';

@autobind
export class LocationPicker extends React.Component {
  // static propTypes = {
  //   options: ImmutablePropTypes.list,
  //   collection: PropTypes.array,
  //   open: PropTypes.bool,
  //   isLoading: PropTypes.bool,
  //   canCreateOnTheFly: PropTypes.bool,
  //   config: PropTypes.bool,
  //   createLocation: PropTypes.func,
  //   fetchLocations: PropTypes.func,
  //   fetchCreateOnTheFly: PropTypes.func,
  //   onChange: PropTypes.func,
  //   showCreatorModal: PropTypes.func,
  //   toggleDropdown: PropTypes.func,
  //   inputName: PropTypes.string,
  //   statusName: PropTypes.string,
  //   noLocationsLabel: PropTypes.string,
  //   value: PropTypes.oneOfType([
  //     PropTypes.object,
  //     PropTypes.number,
  //     ImmutablePropTypes.map,
  //   ]),
  // };

  static defaultProps = {
    open: false,
    inputName: 'location',
    statusMessage: 'statusMessage',
    noLocationsLabel: 'No Locations Available',
    value: Map(),
    options: Map(),
    forceStopAdd: false,
  };

  componentDidMount() {
    const {
      fetchCreateOnTheFly,
      fetchLocations,
      collection,
      config,
    } = this.props;
    fetchLocations(collection);
    fetchCreateOnTheFly(config);
  }

  shouldComponentUpdate({open, value, options, canCreateOnTheFly}) {
    const {
      open: propOpen,
      value: propValue,
      options: propOptions,
      canCreateOnTheFly: propCanCreate,
    } = this.props;
    return (
      canCreateOnTheFly !== propCanCreate ||
      open !== propOpen ||
      !equals(value, propValue) ||
      !is(options, propOptions)
    );
  }

  render() {
    const {
      open,
      inputName,
      options,
      value,
      onChange,
      canCreateOnTheFly,
      toggleDropdown,
      showCreatorModal,
      noLocationsLabel,
      isLoading,
      forceStopAdd,
      collection,
    } = this.props;

    const statusMessage = getLocationStatusMessage(options.count() > 0);

    return (
      <div title={value.full_name} style={{display: 'table', width: '100%'}}>
        <input
          name={inputName}
          type="hidden"
          value={value.id}
        />
      {!canCreateOnTheFly && options.count() === 0 ? (
          <span style={{display: 'table-cell'}}>{noLocationsLabel}</span>
        ) : (
          <QuickAdder
            {... this.props}
            tetherPopup
            filterMessage="Search existing locations..."
            open={!!open}
            canAdd={!forceStopAdd && canCreateOnTheFly}
            data={options.toJS()}
            value={formatNullOrValue(value)}
            className="location-picker quick-adder main-picker"
            popupClassName="quick-adder main-picker"
            placeholder="Select a Location"
            addLabel="+ Create a New Location"
            textField={value => value.full_name}
            valueField="id"
            onToggle={toggleDropdown}
            onClickAdd={showCreatorModal.bind(null, onChange)}
            onChange={onChange}
            onSelect={null}
          />
        )}
        {!canCreateOnTheFly && (
          <span
            className="padding-left"
            style={{display: 'table-cell', verticalAlign: 'middle'}}>
            <OverlayTrigger
              placement="right"
              trigger={['hover', 'focus']}
              delayHide={2000}
              overlay={(
                <Tooltip id="locationPickerTooltip">
                  <span
                    dangerouslySetInnerHTML={{__html: statusMessage}}
                  />
                </Tooltip>
              )}>
              <i className="fa fa-question-circle"/>
            </OverlayTrigger>
          </span>
        )}
      </div>
    );
  }
}

export default connect(
  locationPickerSelector,
  locationMapDispatch,
)(LocationPicker);
