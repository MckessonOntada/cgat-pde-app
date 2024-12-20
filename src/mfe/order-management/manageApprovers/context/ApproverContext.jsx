import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import { DateUtils } from '@src/util/DateUtil';
import { getFullName } from '@src/util/CommonUtils';

const ApproverContext = createContext();

export const useApprover = () => {
  const context = useContext(ApproverContext);
  if (!context) {
    throw new Error('useApprover must be used within a ApproverProvider.');
  }
  return context;
};

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: [],
  role: [],
  dateRange: []
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null
};

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

export const ApproverProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const requestParams = useMemo(
    () => ({
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy || 'name',
      sortOrder: sortConfig.sortOrder || 'asc',
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(filterConfig?.status?.length && { status: [filterConfig.status] }),
      ...(filterConfig?.dateRange?.[0] && { startDate: DateUtils.formatDate(filterConfig.dateRange[0], 'dd/mm/yyyy') }),
      ...(filterConfig?.dateRange?.[1] && { endDate: DateUtils.formatDate(filterConfig.dateRange[1], 'dd/mm/yyyy') })
    }),
    [filterConfig, paginationConfig.pageNumber, sortConfig]
  );

  const {
    isLoading: isLoadingApprovers,
    isError: isErrorApprovers,
    data: approverData,
    refetch: refetchApprovers
  } = useQuery({
    queryKey: ['approvers', requestParams],
    queryFn: async () => {
      const url = `${ApiRoutes.APPROVER_GROUP()}?${serializeParams(requestParams)}`;
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
    refetchOnWindowFocus: false
  });

  let userParams = {
    userType: 'GENERAL',
    status: 'active'
  };

  const {
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    data: usersData,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['usersData'],
    queryFn: async () => {
      const apiUrl = `${ApiRoutes.USERS()}?${serializeParams(userParams)}`;
      const res = await HttpResourceService.callRest(`${apiUrl}`, httpVerb.GET, {});
      if (!res.data?.content) {
        return [];
      }
      return res.data.content.map((item) => ({
        label: getFullName(item.name),
        value: item.id
      }));
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true
  });

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  const applySort = (newSortConfig) => {
    setSortConfig(newSortConfig);
    refetchApprovers();
  };

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig({ ...filters });
    refetchApprovers;
  };

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
    refetchApprovers();
  };

  const ctxValue = useMemo(
    () => ({
      data: approverData || [],
      filterConfig,
      paginationConfig,
      setFilterConfig,
      clearFilters,
      applyFilters,
      applySort,
      setPageNumber,
      usersData,
      refreshData: refetchApprovers
    }),
    [
      approverData,
      filterConfig,
      paginationConfig,
      setFilterConfig,
      clearFilters,
      applyFilters,
      applySort,
      setPageNumber,
      usersData,
      refetchApprovers
    ]
  );
  return <ApproverContext.Provider value={ctxValue}>{children}</ApproverContext.Provider>;
};
