import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { DateUtils } from '@src/util/DateUtil';

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

const UserProvisioningStatusEnum = {
  PENDING: 'PENDING',
  REJECTED: 'REJECTED'
};

export const UserProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(
    INITIAL_PAGINATION_CONFIG
  );
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [activeTab, setActiveTab] = useState(1);

  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const requestParams = useMemo(() => {
    let statusArray = [];

    if (activeTab === 2) {
      if (filterConfig?.status === 'all') {
        statusArray = [
          UserProvisioningStatusEnum.PENDING,
          UserProvisioningStatusEnum.REJECTED
        ];
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
      ...(activeTab === 1 && {
        userType: AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL'
      }),
      ...(activeTab === 1 &&
        filterConfig?.role && { roleIds: [filterConfig.role] }),
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(activeTab === 1
        ? statusArray.length && { status: statusArray }
        : statusArray.length && { provisioningStatuses: statusArray }),
      ...(filterConfig?.dateRange?.[0] && {
        startDate: DateUtils.formatDate(filterConfig.dateRange[0], 'dd/mm/yyyy')
      }),
      ...(filterConfig?.dateRange?.[1] && {
        endDate: DateUtils.formatDate(filterConfig.dateRange[1], 'dd/mm/yyyy')
      })
    };
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, activeTab]);

  const { isLoading, isError, error, data, refetch } = useQuery({
    queryKey: ['users', activeTab, requestParams],
    queryFn: async () => {
      const url =
        activeTab === 1
          ? `${ApiRoutes.USERS()}?${serializeParams(requestParams)}`
          : `${ApiRoutes.USERS_PROVISIONING()}?${serializeParams(
              requestParams
            )}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (res.data) {
        const { content: data, totalElements, totalPages } = res.data;

        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          ...(totalElements && { totalElements }),
          ...(totalPages && { totalPages })
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
      const response = await HttpResourceService.callRest(
        `${ApiRoutes.GET_ROLES()}`,
        httpVerb.GET,
        {}
      );
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
      activeTab,
      setActiveTab,
      refreshData: refetch
    }),
    [
      updateFilterState,
      clearFilters,
      isLoading,
      isError,
      data,
      activeTab,
      setActiveTab,
      refetch
    ]
  );
  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
};
