import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useOrgAccountSelectionContext } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import AccountService from '@src/api/commonService/AccountService';
import { ChannelType } from '../util';

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

const INITIAL_SORT_STATE = {
  sortBy: 'sap_partner',
  sortOrder: 'desc'
};

export const SPAccountProvider = ({ children }) => {
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);

  useEffect(() => {
    clearFilters();
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
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
      sortBy: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      practiceId: selectedOrganization?.id,
      partnerFunction: 'SOLD_TO',
      channelType: ChannelType.SPECIALITY_PHARMA
    };

    return baseParams;
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, selectedOrganization?.id]);

  const {
    isLoading: isLoading,
    isError: isError,
    data: SPAccountList,
    refetch: refetchSPAccountList
  } = useQuery({
    queryKey: ['SPAccounts', selectedOrganization?.id, requestParams],
    queryFn: async () => {
      if (!selectedOrganization?.id) return [];
      const result = await AccountService.getAccountList(requestParams, selectedOrganization?.id);
      const { content: data, totalElements, totalPages } = result;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(selectedOrganization?.id)
  });

  useEffect(() => {
    refetchSPAccountList();
  }, [paginationConfig.pageNumber, sortConfig, filterConfig]);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const contextValue = {
    paginationConfig,
    SPAccountList: SPAccountList || [],
    setPageNumber,
    clearFilters,
    applyFilters,
    isLoading,
    isError,
    filterConfig,
    refetchSPAccountList,
    applySort
  };
  return <SPAccountContext.Provider value={contextValue}>{children}</SPAccountContext.Provider>;
};
