import US_STATE_CITY from '@src/assets/data/US_States_and_Cities.json';

export const getNestedValue = (obj, fieldName) => {
  const keys = fieldName?.split('.');
  return keys.reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

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
