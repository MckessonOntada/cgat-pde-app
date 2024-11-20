import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useOrganizationQuery } from '../slices/Organization';
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
  // We don't need this state after api integration
  const [originalData] = useState(ORG_DATA);
  const [filteredData] = useState(ORG_DATA);
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

  // Fetch data from server
  const { isLoading, data, error } = useOrganizationQuery();

  console.log("data", isLoading, data, error)

  const totalRecords = useMemo(() => originalData.length, [originalData]);
  const totalPageCount = useMemo(
    () => Math.ceil(totalRecords / RECORDS_PER_PAGE),
    [totalRecords]
  );

  
  // const ctxValue = useMemo(
  //   () => ({
  //     data: data.content,
  //     filters: {
  //       ...filterState,
  //       update: {
  //         setSearchQuery: (value) => updateFilterState("searchQuery", value),
  //         setLocation: (value) => updateFilterState("location", value),
  //         setStatus: (value) => updateFilterState("status", value),
  //       },
  //       clearFilters,
  //     },
  //     pagination: {
  //       currentPage: data.pageable.pageNumber,
  //       totalRecords: data.totalElements,
  //       totalPageCount: data.totalPages,
  //       recordsPerPage: RECORDS_PER_PAGE,
  //       update: {
  //         setCurrentPage,
  //       },
  //     },
  //     isLoading
  //   }),
  //   [
  //     filteredData,
  //     updateFilterState,
  //     clearFilters,
  //     currentPage,
  //     totalPageCount,
  //     totalRecords,
  //     isLoading
  //   ]
  // );

  // Until API starts working
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
      isLoading
    }),
    [
      filteredData,
      updateFilterState,
      clearFilters,
      currentPage,
      totalPageCount,
      totalRecords,
      isLoading
    ]
  );

  return <OrgContext.Provider value={ctxValue}>{children}</OrgContext.Provider>;
};
