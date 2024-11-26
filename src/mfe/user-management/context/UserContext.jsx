import React, { createContext, useCallback, useContext,useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/common/util/ApiUtils';
import AuthUtils from '@src/common/util/AuthUtils';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider.');
  }
  return context;
};

const INITIAL_STATE = {
  searchQuery: '',
  location: [],
  status: [],  pagination: {
    currentPage: 0,
    totalRecords: 0,
    totalPageCount: 0,
    recordsPerPage: 0
  }
};

const RECORDS_PER_PAGE = 8;

export const UserProvider = ({ children }) => {
  const [filterState, setFilterState] = useState(INITIAL_STATE);
  const [currentPage, setCurrentPage] = useState(1);

  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const clearFilters = () => {
    setFilterState(INITIAL_STATE);
  };

  // Use from context
  const requestParams = useMemo(() => ({
    pageNo: currentPage-1,
    pageSize: RECORDS_PER_PAGE,
    sortBy: 'first_name',
    sortOrder: 'asc',
    userType: AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL'
  }),[currentPage]);

  const { isLoading, isError, data,refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(
        `${ApiRoutes.USERS()}?${serializeParams(requestParams)}`, // Use practice id from organization
        httpVerb.GET,
        {}
      );
      return res.data;
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    // Refetch on pagination/filters/sorting
    refetch(requestParams)
  },[currentPage, filterState])

  // const applyFilters = useCallback(() => console.log('Apply filters'), []);

  // const onPageChange = useCallback((newPage) => { setCurrentPage(newPage)},[])
  const ctxValue = useMemo(
    () => ({
      isLoading,
      isError,
      data: data?.content || [],
      pagination: {
        currentPage,
        totalPageCount: data?.totalPages || 0,
        totalRecords: data?.totalElements || 0,
        recordsPerPage: RECORDS_PER_PAGE,
        update: {
          setCurrentPage,
        },
      },
      filters: {
        ...filterState,
        update: {
          setSearchQuery: (value) => updateFilterState('searchQuery', value),
          setRole: (value) => updateFilterState('role', value),
          setStatus: (value) => updateFilterState('status', value),
        },
        clearFilters,
      },
      refetch, // Add refetch to context value to reload data
    }),
    [updateFilterState, clearFilters, isLoading, isError, data, currentPage, refetch]
  );
  
  return <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>;
  
};
