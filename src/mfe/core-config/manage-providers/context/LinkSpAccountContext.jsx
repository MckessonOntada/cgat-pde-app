import AccountService from '@src/api/commonService/AccountService';
import { useOrgAccountSelectionContext } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import { ChannelType } from '@src/mfe/order-management/pages/system-configuration/manage-spaccount/util';
import AuthUtils from '@src/util/AuthUtils';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useQuery } from 'react-query';
import { useLocation, useSearchParams } from 'react-router-dom';

const LinkSpAccountContext = createContext();

export const useLinkSpAccountContext = () => {
  const context = useContext(LinkSpAccountContext);
  if (!context) {
    throw new Error(
      'useLinkSpAccountContext must be used within a LinkSpAccountContext.'
    );
  }
  return context;
};

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
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

export const LinkSpAccountProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(
    INITIAL_PAGINATION_CONFIG
  );
  const location = useLocation();
  const practiceId = AuthUtils.getPracticeId();
  const isAddSpAccount = useMemo(() => {
    return location.pathname.includes('link-sp-accounts');
  }, [location.pathname]);

  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);

  const requestParams = useMemo(
    () => ({
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      practiceId: practiceId,
      partnerFunction: 'SOLD_TO',
      channelType: ChannelType.SPECIALITY_PHARMA
    }),
    [filterConfig, paginationConfig.pageNumber, sortConfig]
  );
  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ['sp-account', requestParams, practiceId],
    queryFn: async () => {
      let result;
      if (isAddSpAccount) {
        result = await AccountService.getAccountList(requestParams, practiceId);
      } else {
        result = await AccountService.getAccountList(requestParams, practiceId);
      }
      const { content: data, totalElements, totalPages } = result;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return data;
    },

    refetchOnWindowFocus: false
  });

  useEffect(() => {
    refetch();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig({ ...filters });
  };

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const ctxValue = useMemo(
    () => ({
      data: data || [],
      isLoading,
      isError,
      error,
      filterConfig,
      paginationConfig,
      setFilterConfig,
      clearFilters,
      applyFilters,
      applySort,
      setPageNumber,
      refreshData: refetch,
      isAddSpAccount
    }),
    [updateFilterState, clearFilters, data]
  );
  return (
    <LinkSpAccountContext.Provider value={ctxValue}>
      {children}
    </LinkSpAccountContext.Provider>
  );
};
