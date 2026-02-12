import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { DateUtils } from '@src/util/DateUtil';
import { USER_TABS } from '../pages/Dashboard/constants';
import { useLocation } from 'react-router-dom';

const UserContext = createContext();

const ACTIVE_USERS = 'ACTIVE USERS';

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider.');
  }
  return context;
};

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: 'all',
  role: [],
  dateRange: []
};

const INITIAL_SORT_STATE = {
  sortBy: 'updated_At',
  sortOrder: 'desc'
};

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

const UserProvisioningStatusEnum = {
  PENDING: 'PENDING',
  REJECTED: 'REJECTED'
};

export const UserProvider = ({ children }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const requestParams = useMemo(() => {
    let statusArray = [];
    if (tab === USER_TABS.PENDING_REQUESTS) {
      if (filterConfig?.status === 'all') {
        statusArray = [UserProvisioningStatusEnum.PENDING, UserProvisioningStatusEnum.REJECTED];
      } else if (filterConfig?.status) {
        statusArray = [filterConfig.status];
      }
    } else if (filterConfig?.status) {
      statusArray = [filterConfig.status];
    }

    return {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy || 'first_name',
      sortOrder: sortConfig.sortOrder || 'asc',
      ...(tab === USER_TABS.USERS && {
        userType: AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL'
      }),
      ...(tab === USER_TABS.USERS && filterConfig?.role && { roleIds: [filterConfig.role] }),
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(tab === USER_TABS.USERS ? statusArray.length && { status: statusArray } : statusArray.length && { provisioningStatuses: statusArray }),
      ...(filterConfig?.dateRange?.[0] && {
        startDate: DateUtils.formatDate(filterConfig.dateRange[0], 'dd/mm/yyyy')
      }),
      ...(filterConfig?.dateRange?.[1] && {
        endDate: DateUtils.formatDate(filterConfig.dateRange[1], 'dd/mm/yyyy')
      })
    };
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, location.search]);

  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ['users', tab, requestParams],
    queryFn: async () => {
      const url =
        tab === USER_TABS.USERS
          ? `${ApiRoutes.USERS()}?${serializeParams(requestParams)}`
          : `${ApiRoutes.USERS_PROVISIONING()}?${serializeParams(requestParams)}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (res.data) {
        const { content: data, totalElements, totalPages } = res.data;

        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          totalElements,
          totalPages
        }));

        return data;
      }

      return [];
    },
    refetchOnWindowFocus: false
  });

  const { data: roleList = [] } = useQuery({
    queryKey: ['user', 'roles-list'],
    queryFn: async () => {
      const response = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLES()}?${serializeParams({ isPhysicianRequired: false })}`, httpVerb.GET, {});
      if (response.data) {
        const { content: data } = response.data;
        return data.map((item) => ({
          label: item.name,
          value: item.id
        }));
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  useEffect(() => {
    refetch();
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
      roleList,
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
      refreshData: refetch
    }),
    [updateFilterState, clearFilters, isLoading, isError, data, refetch]
  );
  return <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>;
};
