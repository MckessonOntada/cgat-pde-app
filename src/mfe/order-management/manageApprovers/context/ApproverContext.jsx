import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';

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

export const GROUP_DATA = [
  {
    id: 1,
    groupName: 'TXO Approver Group_1',
    createdBy: 'Sally Thyer',
    createdOn: '01-01-2024',
    isActive: true
  },
  {
    id: 2,
    groupName: 'TXO Approver Group_2',
    createdBy: 'Sally Thyer',
    createdOn: '11/11/2024',
    isActive: true
  }
];

export const ApproverProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [data, setData] = useState(GROUP_DATA);
  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  // Use from context
  const requestParams = useMemo(
    () => ({
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy || 'group_name',
      sortOrder: sortConfig.sortOrder || 'asc',
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(filterConfig?.status?.length && { status: [filterConfig.status] })
    }),
    [filterConfig, paginationConfig.pageNumber, sortConfig]
  );

  //   const { isLoading, isError, data, refetch } = useQuery({
  //     queryKey: ['approvers', requestParams],
  //     queryFn: async () => {
  //       const url = `${ApiRoutes.ApproverS()}?${serializeParams(requestParams)}`;
  //       const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
  //       if (res.data) {
  //         const { content: data, totalElements, totalPages } = res.data;

  //         setPaginationConfig((prevConfig) => ({
  //           ...prevConfig,
  //           ...(totalElements && { totalElements }),
  //           ...(totalPages && { totalPages })
  //         }));
  //         return data;
  //       }

  //       return [];
  //     },
  //     refetchOnWindowFocus: false
  //   });

  let userParams = {
    userType: 'GENERAL',
    status: 'active'
  };

  const {
    isLoading,
    data: usersData,
    isError,
    refetch
  } = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const apiUrl = `${ApiRoutes.USERS()}?${serializeParams(userParams)}`;
      const res = await HttpResourceService.callRest(`${apiUrl}`, httpVerb.GET, {});
      if (res.data?.content) {
        return res.data?.content?.map((item) => ({
          label: `${item.name.lastName}, ${item.name.firstName} ${item.name.middleName || ''}`.trim(),
          value: item.id
        }));
      }
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true
  });

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  useEffect(() => {
    //refetch();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

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
      //   isLoading,
      //   isError,
      filterConfig,
      paginationConfig,
      setFilterConfig,
      clearFilters,
      applyFilters,
      applySort,
      setPageNumber,
      usersData
    }),
    [updateFilterState, clearFilters, usersData]
  );
  return <ApproverContext.Provider value={ctxValue}>{children}</ApproverContext.Provider>;
};
