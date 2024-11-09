import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ORG_DATA } from "../mockData/orgData";
import { RECORDS_PER_PAGE } from "./utils";

const OrgContext = createContext();

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("useOrg must be used within a OrganizationProvider.");
  }
  return context;
};

const INITIAL_STATE = {
  searchQuery: "",
  location: [],
  status: [],
  pagination: {
    currentPage: 0,
    totalRecords: 0,
    totalPageCount: 0,
    recordsPerPage: 0,
  },
};

export const OrganizationProvider = ({ children }) => {
  const [filterState, setFilterState] = useState(INITIAL_STATE);
  const [originalData, setOriginalData] = useState(ORG_DATA);
  const [filteredData, setFilteredData] = useState(ORG_DATA);
  const [currentPage, setCurrentPage] = useState(1);

  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  const clearFilters = () => {
    setFilterState(INITIAL_STATE);
    console.log("Filter Cleared.");
  };

  // useEffect(() => {
  //   // On filter state change, give api call

  // }, [filterState])

  //  Apply filters = user rtk to call api

  // This is not needed if we do it on server side
  useEffect(() => {
    if (originalData.length > 0) {
      const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
      const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
      setFilteredData(
        originalData.slice(indexOfFirstRecord, indexOfLastRecord)
      );
    } else {
      setFilteredData([]);
    }
  }, [originalData, currentPage]);

  const totalRecords = useMemo(() => originalData.length, [originalData]);
  const totalPageCount = useMemo(
    () => Math.ceil(totalRecords / RECORDS_PER_PAGE),
    [totalRecords]
  );

  const ctxValue = useMemo(
    () => ({
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
    }),
    [
      filteredData,
      updateFilterState,
      clearFilters,
      currentPage,
      totalPageCount,
      totalRecords,
    ]
  );

  return <OrgContext.Provider value={ctxValue}>{children}</OrgContext.Provider>;
};
