import US_STATE_CITY from '@src/assets/data/US_States_and_Cities.json';

export function getNestedValue(obj, path, defaultValue = undefined) {
  // the regex will de structure the error format (Ex: name.address.line1 or name[0].value)
  const pathArray = path.replace(/\[(\w+)\]/g, '.$1').split('.');
  return pathArray.reduce((acc, key) => {
    if (acc && acc[key] !== undefined) {
      return acc[key];
    }
    return defaultValue;
  }, obj);
}

export const US_STATES_CITIES = () => {
  const _options = [];

  for (let s in US_STATE_CITY) {
    let CITIES_IN_STATE = US_STATE_CITY[s];

    for (let city of CITIES_IN_STATE) {
      _options.push({
        isDisabled: false,
        value: city,
        label: city
      });
    }
  }

  return _options; // .splice(0, 10);
};

export const US_STATES = () => {
  const _options = [];

  for (let state in US_STATE_CITY) {
    _options.push({
      isDisabled: false,
      value: state,
      label: state
    });
  }

  return _options;
};

export const US_CITIES_OF_STATE = (state) => {
  const _options = [];

  let CITIES_IN_STATE = US_STATE_CITY[state];

  for (let city of CITIES_IN_STATE) {
    _options.push({
      isDisabled: false,
      value: city,
      label: city
    });
  }

  return _options; // .splice(0, 10);
};
