const FIELD_INITIAL_STATE = {
    'dropdown': "", 
    'multiSelectDropdown': [],
    'datepicker': null,
    'dateRange': {
        start: null,
        end: null
    }
}

export const generateInitialFilterState = (filters) => {
    if (!filters || !Array.isArray(filters)) {
      return {}; // Return an empty object if filters is undefined or not an array
    }
  
    const initialState = {};
    filters.forEach((filter) => {
      initialState[filter.name] = filter.defaultValue || '';
    });
    return initialState;
  };