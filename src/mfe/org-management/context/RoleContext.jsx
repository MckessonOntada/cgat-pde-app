import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from "react";
import { ROLE_DATA } from "../mockData/roleData";
  
  const RoleContext = createContext();
  
  export const useRole = () => {
    
    const context = useContext(RoleContext);
    if (!context) {
      throw new Error("useRole must be used within an RoleanizationProvider.");
    }
    return context;
  };
  
  const INITIAL_STATE = {
    searchQuery: "",
    location: [],
    status: [],
  };
  
  export const RoleProvider = ({ children }) => {
    const [filterState, setFilterState] = useState(INITIAL_STATE);
    const [originalData] = useState(ROLE_DATA);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const RECORDS_PER_PAGE = 8;
    
    const updateFilterState = useCallback((field, value) => {
      setFilterState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }, []);
  
    const clearFilters = useCallback(() => {
      setFilterState(INITIAL_STATE);
      console.log("Filters cleared.");
    }, []);

    useEffect(() => {
      const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
      const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
  
      setFilteredData(
        originalData.slice(indexOfFirstRecord, indexOfLastRecord)
      );
    }, [originalData, currentPage]);
  
    const totalRecords = originalData.length;
    const totalPageCount = Math.ceil(totalRecords / RECORDS_PER_PAGE);
  
    const ctxValue = useMemo(() => ({
      data: filteredData,
      filters: {
        ...filterState,
        update: {
          setSearchQuery: (value) => updateFilterState("searchQuery", value),
          setLocation: (value) => updateFilterState("location", value),
          setStatus: (value) => updateFilterState("status", value),
        },
        clearFilters,
      },
      pagination: {
        currentPage,
        totalRecords,
        totalPageCount,
        recordsPerPage: RECORDS_PER_PAGE,
        update: {
          setCurrentPage,
        },
      },
    }), [
      filteredData,
      filterState,
      clearFilters,
      currentPage,
      totalPageCount,
      totalRecords,
      updateFilterState,
    ]);
  
    return (
      <RoleContext.Provider value={ctxValue}>
        {children}
      </RoleContext.Provider>
    );
  };
  