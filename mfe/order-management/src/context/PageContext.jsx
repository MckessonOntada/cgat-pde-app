import React, {
  createContext,
  useCallback,
  useContext, 
  useEffect,
  useMemo,
  useState,
} from "react";
import { ORDER_DATA } from '../mockData/OrderData';
import { RECORDS_PER_PAGE } from "./utils";
const OrderContext = createContext();

export const UseOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("UseOrder must be used within a OrderProvider.");
  }
  return context;
};

const INITIAL_STATE = {
  searchQuery: "", 
  status: [],
  pagination: {
    currentPage: 0,
    totalRecords: 0,
    totalPageCount: 0,
    recordsPerPage: 0,
  },
};

export const OrderProvider = ({ children }) => {
  const [originalData, setOriginalData] = useState(ORDER_DATA);
  const [filterState, setFilterState] = useState(INITIAL_STATE);
  const [filteredData, setFilteredData] = useState(ORDER_DATA);
  const [currentPage, setCurrentPage] = useState(1);

  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  const clearFilters = () => {
    setFilterState(INITIAL_STATE); 
  };

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
  
  const applyFilters = useCallback(() => { 
  //To do  
  },[originalData]);
 
  const ctxValue = useMemo(
    () => ({
      data: filteredData,
      filters: {
        ...filterState,
        update: {
          setSearchQuery: (value) => updateFilterState("searchQuery", value), 
          setStatus: (value) => updateFilterState("status", value),
        },
        clearFilters,
        applyFilters
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
    [filteredData, updateFilterState, clearFilters, applyFilters,currentPage,
      totalPageCount,
      totalRecords,]
  );
  console.log("FilterState:", filterState);
  return <OrderContext.Provider value={ctxValue}>{children}</OrderContext.Provider>;
};