import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { PaymentHistoryData } from "../mockData/PaymentHistoryData";

const PaymentInvoiceContext = createContext();

export const usePaymentHistory = () => {
  const context = useContext(PaymentInvoiceContext);
  if (!context) {
    throw new Error("usePaymentHistory must be used within a PaymentHistoryProvider.");
  }
  return context;
};

const INITIAL_STATE = {
  searchQuery: "",
  location: [],
  status: [],
};

export const PaymentHistoryProvider = ({ children }) => {
  const [originalData, setOriginalData] = useState(PaymentHistoryData);
  const [filterState, setFilterState] = useState(INITIAL_STATE);
  const [filteredData, setFilteredData] = useState(PaymentHistoryData);

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
    setFilteredData(originalData)
  }, [originalData]);

  const ctxValue = useMemo(() => ({
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
  return <PaymentInvoiceContext.Provider value={ctxValue}>{children}</PaymentInvoiceContext.Provider>;
};