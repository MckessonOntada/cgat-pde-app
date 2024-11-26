import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/common/util/ApiUtils';
import CommonDataService from '../../../api/commonService/CommonDataService';

const RECORDS_PER_PAGE = 8;

const OrgContext = createContext();

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrg must be used within a OrganizationProvider.');
  }
  return context;
};

const INITIAL_STATE = {
  searchQuery: '',
  location: [],
  status: [],
  pagination: {
    currentPage: 0,
    totalRecords: 0,
    totalPageCount: 0,
    recordsPerPage: 0
  }
};

export const OrganizationProvider = ({ children }) => {
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
    console.log('Filter Cleared.');
  };

  // use from context
  const requestParams = useMemo(
    () => ({
      pageNo: currentPage - 1,
      pageSize: RECORDS_PER_PAGE,
      sortBy: 'name',
      sortOrder: 'asc'
    }),
    [currentPage]
  );

  // Fetch data from server
  const { isLoading, data, isError, refetch } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      // const res = await HttpResourceService.callRest(
      //   `${ApiRoutes.ORGANIZATIONS}?${serializeParams(requestParams)}`, // Use practice id from organization
      //   httpVerb.GET,
      //   {}
      // );

      // // console.log("res", res);
      // return res.data;
      return CommonDataService.getOrganizationList(requestParams)
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    // Refetch on pagination/filters/sorting
    refetch(requestParams);
  }, [currentPage, filterState]);

  const ctxValue = useMemo(
    () => ({
      data: data?.content,
      filters: {
        ...filterState,
        update: {
          setSearchQuery: (value) => updateFilterState('searchQuery', value),
          setLocation: (value) => updateFilterState('location', value),
          setStatus: (value) => updateFilterState('status', value)
        },
        clearFilters
      },
      pagination: {
        currentPage: currentPage,
        totalRecords: data?.totalElements,
        totalPageCount: data?.totalPages,
        recordsPerPage: RECORDS_PER_PAGE,
        update: {
          setCurrentPage
        }
      },
      isLoading,
      isError
    }),
    [data, updateFilterState, clearFilters, currentPage, isLoading, isError]
  );

  return <OrgContext.Provider value={ctxValue}>{children}</OrgContext.Provider>;
};
