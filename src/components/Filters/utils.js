const FIELD_INITIAL_STATE = {
    'select': "", 
    'multiselect': [],
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