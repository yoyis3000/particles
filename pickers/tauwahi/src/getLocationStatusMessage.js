/* global Procore */

function _getMessageAdmin(hasLocations) {
  const { Environment: {baseUrl} } = Procore;
  const adminUrl = `${baseUrl}admin/locations`;

  let message = 'Locations can be managed in the ' +
          `<a href=${adminUrl} target='_blank'>Project Admin tab</a>`;

  if (hasLocations) {
    message = 'New locations can be added via the locations manager' +
      ` in the <a href=${adminUrl} target='_blank'>Project Admin tab</a>`;
  }
  return message;
}

function _getMessageStandard(hasLocations) {
  let message = `Locations can only be managed by a Project Administrator`;

  if (hasLocations) {
    message = 'New locations can only be added by a Project Administrator.';
  }
  return message;
}

function getLocationStatusMessage(hasLocations) {
  let message = _getMessageStandard(hasLocations);
  if (Procore.Environment.isAdmin()) {
    message = _getMessageAdmin(hasLocations);
  }
  return message;
}

export default getLocationStatusMessage;
