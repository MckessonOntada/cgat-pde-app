import React, { createContext, useContext, useState } from 'react';

const AccountsTableContext = createContext();

export const useAccountsTable = () => {
  return useContext(AccountsTableContext);
};

export const AccountsTableProvider = ({ children, initialData = [] }) => {
  const initialFilterState = {
    searchQuery: '',
    role: '',
    isActive: true,
  };

  const [filterState, setFilterState] = useState(initialFilterState);
  const [pageConfig, setPageConfig] = useState({
    total: initialData.length,
    pageSize: 10,
    pages: Math.ceil(initialData.length / 10),
    currentPage: 1,
  });
  const [dataState, setAccountData] = useState(initialData);

  const applyFilters = (filters) => {
    setCurrentPage(1);
    setFilterState((prevFilters) => ({ ...prevFilters, ...filters }));
  };

  const clearFilters = () => {
    setFilterState({ ...initialFilterState });
  };

  const updatePageConfig = (newConfig) => {
    setPageConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  };

  const setPageSize = (size) => {
    setPageConfig((prevState) => ({ ...prevState, pageSize: size }));
  };

  const setCurrentPage = (page) => {
    setPageConfig((prevState) => ({ ...prevState, currentPage: page }));
  };

  return (
    <AccountsTableContext.Provider
      value={{
        filterState,
        pageConfig,
        dataState,
        applyFilters,
        clearFilters,
        setPageSize,
        setCurrentPage,
        updatePageConfig,
        setAccountData,
      }}
    >
      {children}
    </AccountsTableContext.Provider>
  );
};
