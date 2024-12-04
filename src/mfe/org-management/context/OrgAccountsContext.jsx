import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';

const RECORDS_PER_PAGE = 8;

const OrgAccountsContext = createContext();

export const useOrgAccounts = () => {
  const context = useContext(OrgAccountsContext);
  if (!context) {
    throw new Error('useOrg must be used within a OrganizationProvider.');
  }
  return context;
};

const INITIAL_STATE = {
  searchQuery: '',
  salesOrg: '',
  distributionChannel: '',
  pagination: {
    currentPage: 0,
    totalRecords: 0,
    totalPageCount: 0,
    recordsPerPage: 0
  }
};

const INITIAL_SORT_PARAMS = {
  sortBy: 'name_1',
  sortOrder: 'asc'
};

export const OrgAccountsProvider = ({ children, addNewAccounts, practiceId }) => {
  const [filterState, setFilterState] = useState(INITIAL_STATE);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState(INITIAL_SORT_PARAMS);

  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const clearFilters = () => {
    setFilterState(INITIAL_STATE);
    setTimeout(() => {
      refetch();
    }, 500);
  };
  // use from context
  const apiUrl = useMemo(() => {
    let params = {
      pageNo: currentPage - 1,
      pageSize: RECORDS_PER_PAGE,
      sortBy: sortCriteria.sortBy,
      sortOrder: sortCriteria.sortOrder,
      practiceId,
      partnerFunction: 'SOLD_TO'
    };
    if (filterState.searchQuery) {
      params.query = filterState.searchQuery;
    }
    if (filterState.distributionChannel) {
      params.distributionChannel = filterState.distributionChannel;
    }
    if (filterState.salesOrg) {
      params.salesOrg = filterState.salesOrg;
    }

    if (practiceId && !addNewAccounts) {
      return `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts?${serializeParams(params)}`;
    } else if (practiceId && addNewAccounts) {
      return `${ApiRoutes.PUBLIC_ACCOUNTS}?${serializeParams(params)}`;
    }
  }, [currentPage, practiceId, addNewAccounts, filterState, sortCriteria]);

  // Fetch data from server
  const { isLoading, data, isError, refetch } = useQuery({
    queryKey: ['org_accounts', practiceId],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(`${apiUrl}`, httpVerb.GET, {});
      return res.data;
    },
    retry: 0,
    enabled: false
  });

  useEffect(() => {
    refetch();
  }, [currentPage, addNewAccounts, filterState]);

  const ctxValue = useMemo(
    () => ({
      data: data,
      filters: {
        ...filterState,
        update: {
          setSearchQuery: (value) => updateFilterState('searchQuery', value),
          updateQuery: updateFilterState
        },
        clearFilters
      },
      pagination: {
        currentPage: currentPage,
        totalRecords: data?.totalElements,
        totalPageCount: data?.totalPages,
        recordsPerPage: RECORDS_PER_PAGE,
        setCurrentPage: setCurrentPage
      },
      isLoading,
      isError,
      refetch,
      setSortCriteria,
      setFilterState
    }),
    [data, updateFilterState, clearFilters, currentPage, isLoading, isError]
  );

  return <OrgAccountsContext.Provider value={ctxValue}>{children}</OrgAccountsContext.Provider>;
};
