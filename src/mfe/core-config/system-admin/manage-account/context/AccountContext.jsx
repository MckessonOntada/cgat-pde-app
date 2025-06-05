import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import { useOrgAccountSelectionContext } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import { ChannelType } from '../../manage-sp-account/util';

const RECORDS_PER_PAGE = 8;

const AccountContext = createContext();

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('UseAccount must be used within a AccountProvider.');
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

const INITIAL_FILTER_STATE = {
  searchQuery: ''
};

export const AccountProvider = ({ children }) => {
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [fileteredData, setfileteredData] = useState(false);
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
    setfileteredData(true);
  };

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
    setfileteredData(false);
  };

  const requestParams = React.useMemo(() => {
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
    data: AccountList,
    refetch: refetchAccountList
  } = useQuery({
    queryKey: ['Accounts', selectedOrganization?.id, requestParams],
    queryFn: async () => {
      if (!selectedOrganization?.id) return [];
      const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization?.id}/accounts?${serializeParams(requestParams)}`;

      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (!res.data) {
        return [];
      }
      const { content: data, totalElements, totalPages } = res.data;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedOrganization && selectedOrganization?.id ? true : false
  });

  useEffect(() => {
    refetchAccountList();
  }, [paginationConfig.pageNumber, filterConfig]);

  const contextValue = {
    paginationConfig,
    AccountList: AccountList || [],
    setPageNumber,
    clearFilters,
    applyFilters,
    isLoading,
    isError,
    filterConfig,
    fileteredData
  };
  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>;
};
