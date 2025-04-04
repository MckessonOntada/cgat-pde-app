import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import { useOrgAccountSelectionContext } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import SPAccountService from '@src/api/commonService/SPAccountService';

const RECORDS_PER_PAGE = 8;

const SPAccountContext = createContext();

export const useSPAccountContext = () => {
  const context = useContext(SPAccountContext);
  if (!context) {
    throw new Error('UseSPAccount must be used within a SPAccountProvider.');
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

export const SPAccountProvider = ({ children }) => {
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);

  useEffect(() => {
    clearFilters();
  }, [selectedOrganization]);

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

  const requestParams = useMemo(() => {
    const baseParams = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      practiceId: selectedOrganization?.id,
      partnerFunction: 'SOLD_TO'
    };

    return baseParams;
  }, [filterConfig, paginationConfig.pageNumber, selectedOrganization?.id]);

  const {
    isLoading: isLoading,
    isError: isError,
    data: SPAccountList,
    refetch: refetchSPAccountList
  } = useQuery({
    queryKey: ['SPAccounts', selectedOrganization?.id, requestParams],
    queryFn: async () => {
      const result = await SPAccountService.getSPAccountList(requestParams);
      const { totalElements, totalPages } = result;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return result.data?.slice(
        (paginationConfig.pageNumber - 1) * paginationConfig.pageSize,
        paginationConfig.pageNumber * paginationConfig.pageSize
      );
    }
  });
  console.log('SPACcountList', SPAccountList);
  useEffect(() => {
    refetchSPAccountList();
  }, [paginationConfig.pageNumber, filterConfig]);

  const contextValue = {
    paginationConfig,
    SPAccountList: SPAccountList || [],
    setPageNumber,
    clearFilters,
    applyFilters,
    isLoading,
    isError,
    filterConfig
  };
  return <SPAccountContext.Provider value={contextValue}>{children}</SPAccountContext.Provider>;
};
