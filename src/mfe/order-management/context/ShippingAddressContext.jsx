import React, { createContext, useContext, useState } from 'react';

const initialFilterState = {
  searchQuery: '',
  customerIndicators: [],
  salesOrganization: []
};

const initialPageConfig = {
  total: 0,
  pageSize: 10,
  pages: 0,
  currentPage: 1,
};

const initialDataState = [];

const ShippingAddressContext = createContext();

export const useShippingAddress = () => {
  return useContext(ShippingAddressContext);
};

export const ShippingAddressProvider = ({ children }) => {
  const [filterState, setFilterState] = useState(initialFilterState);
  const [pageConfig, _setPageConfig] = useState(initialPageConfig);
  const [dataState, setDataState] = useState(initialDataState);

  const applyFilters = (filters) => {
    setFilterState((prevFilters) => ({...prevFilters, ...filters}));
  };

  const clearFilters = () => {
    setFilterState({...initialFilterState});
  }

  const setPageConfig = (state) => {
    _setPageConfig({...state})
  }

  const setPageSize = (size) => {
    _setPageConfig((prevState) => ({ ...prevState, pageSize: size }));
  };

  const setCurrentPage = (page) => {
    _setPageConfig((prevState) => ({ ...prevState, currentPage: page }));
  };

  const setShippingAddressData = (data) => {
    setDataState((prevState) => ([...data]));
  };

  return (
    <ShippingAddressContext.Provider
      value={{
        filterState,
        pageConfig,
        dataState,
        applyFilters,
        clearFilters,
        setPageConfig,
        setPageSize,
        setCurrentPage,
        setShippingAddressData,
      }}
    >
      {children}
    </ShippingAddressContext.Provider>
  );
};
