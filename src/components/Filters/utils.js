const FIELD_INITIAL_STATE = {
    'dropdown': "", 
    'multiselectDropdown': [],
    'datepicker': null,
    'dateRange': {
        start: null,
        end: null
    }
}

export function generateInitialFilterState(additionalFilters){
    let initialState = {
        searchQuery: ""
    }
    additionalFilters.forEach(item => {
        initialState[item.name] = FIELD_INITIAL_STATE[item.type]
    });
    return initialState;
}