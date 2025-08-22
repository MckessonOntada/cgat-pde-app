import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import { useOrgAccountSelectionContext } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';

const RECORDS_PER_PAGE = 8;

const CatalogContext = createContext();

export const useCatalogContext = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('UseCatalog must be used within a CatalogProvider.');
  }
  return context;
};

// const RECORDS_PER_PAGE = 8;

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: RECORDS_PER_PAGE,
  totalPages: 0,
  pageNumber: 1
};
const INITIAL_SORT_STATE = {
  sortBy: 'sap_material',
  sortOrder: 'desc'
};
const INITIAL_FILTER_STATE = {
  searchQuery: ''
};

export const CatalogProvider = ({ children }) => {
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const { selectedAccount, selectedOrganization, options, accountOptions } = useOrgAccountSelectionContext();
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);

  useEffect(() => {
    clearFilters();
  }, [selectedOrganization, selectedAccount]);

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

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  const requestParams = useMemo(() => {
    const params = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      ...(filterConfig.searchQuery && { query: filterConfig.searchQuery })
    };

    if (selectedOrganization) {
      params.practiceIdList = selectedOrganization.id;
    }

    if (selectedAccount?.length > 0) {
      const accNumbers = selectedAccount.filter((i) => i.isChecked).map((i) => i.accountNumber);
      if (accNumbers.length > 0) {
        params.accountNumbers = accNumbers;
      }
    }

    return params;
  }, [selectedOrganization, selectedAccount, paginationConfig.pageNumber, paginationConfig.pageSize, filterConfig.searchQuery]);

  const {
    isLoading,
    isError,
    error,
    data: catalogList,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['catalogList', requestParams],
    queryFn: async () => {
      const url = `${ApiRoutes.GET_CATALOG_DATA()}?${serializeParams(requestParams)}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (res.data) {
        const { content: data, totalElements, totalPages } = res.data;
        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          totalElements,
          totalPages
        }));
        return data;
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    refetch();
  }, [paginationConfig.pageNumber, filterConfig]);

  const contextValue = {
    paginationConfig,
    catalogList: catalogList || [],
    setPageNumber,
    clearFilters,
    applyFilters,
    isLoading: isFetching,
    filterConfig
  };
  return <CatalogContext.Provider value={contextValue}>{children}</CatalogContext.Provider>;
};
