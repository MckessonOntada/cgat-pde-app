import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

const RECORDS_PER_PAGE = 8;

const ShippingLocationContext = createContext();

export const useShippingLocationContext = () => {
  const context = useContext(ShippingLocationContext);
  if (!context) {
    throw new Error('UseShippingLocation must be used within a ShippingLocationProvider.');
  }
  return context;
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: RECORDS_PER_PAGE,
  totalPages: 0,
  pageNumber: 1
};

const INITIAL_FILTER_STATE = {
  searchQuery: ''
};

export const ShippingLocationProvider = ({ children }) => {
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
  };

  const clearFilters = () => setFilterConfig(INITIAL_FILTER_STATE);

  const contextValue = {
    paginationConfig,
    setPageNumber,
    clearFilters,
    applyFilters
  };
  return <ShippingLocationContext.Provider value={contextValue}>{children}</ShippingLocationContext.Provider>;
};
