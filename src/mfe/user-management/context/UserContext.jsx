import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/common/util/ApiUtils';

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
  status: []
};

export const UserProvider = ({ children }) => {
  const [filterState, setFilterState] = useState(INITIAL_STATE);

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
  const requestParams = {
    pageNo: 0,
    pageSize: 20,
    sortBy: 'first_name',
    sortOrder: 'asc',
    userType: 'ADMIN'
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(
        `${ApiRoutes.GET_USERS_LIST}/1/users?${serializeParams(requestParams)}`, // Use practice id from organization
        httpVerb.GET,
        {}
      );
      return res.data;
    },
    refetchOnWindowFocus: false
  });

  const applyFilters = useCallback(() => console.log('Apply filters'), []);
  const ctxValue = useMemo(
    () => ({
      isLoading,
      isError,
      data: data?.content || [],
      filters: {
        ...filterState,
        update: {
          setSearchQuery: (value) => updateFilterState('searchQuery', value),
          setRole: (value) => updateFilterState('role', value),
          setStatus: (value) => updateFilterState('status', value)
        },
        clearFilters,
        applyFilters
      }
    }),
    [updateFilterState, clearFilters, applyFilters, isLoading, isError, data]
  );
  console.log('FilterState:', filterState);
  return <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>;
};
