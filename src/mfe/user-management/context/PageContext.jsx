import React, {
    createContext,
    useCallback,
    useContext, 
    useMemo,
    useState,
  } from "react";
  import { USER_DATA } from '../mockData/UsersData';
  
  const UserContext = createContext();
  
  export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error("useUser must be used within a UserProvider.");
    }
    return context;
  };
  
  const INITIAL_STATE = {
    searchQuery: "",
    location: [],
    status: [],
  };
  
  export const UserProvider = ({ children }) => {
    const [originalData, setOriginalData] = useState(USER_DATA);
    const [filterState, setFilterState] = useState(INITIAL_STATE);
    const [filteredData, setFilteredData] = useState(USER_DATA);
  
    const updateFilterState = useCallback((field, value) => {
      setFilterState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }, []);
  
    const clearFilters = () => {
      setFilterState(INITIAL_STATE); 
    };

    const applyFilters = useCallback(() => {
      // Apply filters & fetch data from api
      setFilteredData(originalData)
    },[originalData]);
   
    const ctxValue = useMemo(
      () => ({
        data: filteredData,
        filters: {
          ...filterState,
          update: {
            setSearchQuery: (value) => updateFilterState("searchQuery", value),
            setRole: (value) => updateFilterState("role", value),
            setStatus: (value) => updateFilterState("status", value),
          },
          clearFilters,
          applyFilters
        },
      }),
      [filteredData, updateFilterState, clearFilters, applyFilters]
    );
    console.log("FilterState:", filterState);
    return <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>;
  };