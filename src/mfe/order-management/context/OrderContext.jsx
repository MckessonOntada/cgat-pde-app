import OrderService from '@src/api/commonService/OrderService';
import React, { createContext, useContext, useState } from 'react';
import { MdViewArray } from 'react-icons/md';
import { useQuery } from 'react-query';
import { StatusEnum } from '../pages/orders/constants';

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: []
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null
};

const INITIAL_DATA_STATE = [];

const OrderContext = createContext();

export const useOrders = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = React.useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = React.useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = React.useState(INITIAL_SORT_STATE);
  const [dataState, setDataState] = React.useState(INITIAL_DATA_STATE);
  const [tabVariant, setTabVariant] = React.useState(1);

  const requestParams = React.useMemo(() => {
    const validStatuses = [StatusEnum.IN_DRAFT, StatusEnum.APPROVAL_PENDING, StatusEnum.SUBMITTED, 'all'];
    const isStatusValid = validStatuses.includes(filterConfig.status);

    const params = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy || 'createdAt',
      sortOrder: sortConfig.sortOrder || 'desc',
      showMyOrders: false,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(tabVariant === 2
        ? { statuses: `${StatusEnum.SUBMITTED}` }
        : {
            statuses:
              isStatusValid && filterConfig.status !== 'all'
                ? filterConfig.status
                : `${StatusEnum.IN_DRAFT},${StatusEnum.APPROVAL_PENDING}, ${StatusEnum.REJECTED}`
          })
    };
    return params;
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, tabVariant]);

  const {
    isFetching,
    refetch: refreshData,
    error
  } = useQuery({
    queryKey: ['orders', tabVariant],
    queryFn: async () => OrderService.getOrders(requestParams),
    onSuccess: (result) => {
      const { totalElements, totalPages } = result;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      if (result.content) {
        setDataState(result.content);
      }
    }
  });

  const { isLoading, data: assginedGroupsData = {} } = useQuery({
    queryKey: ['order', 'approver-group'],
    queryFn: async () => {
      const res = await OrderService.getAssignedGroups(requestParams);
      return res;
    },

    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    refreshData();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, tabVariant]);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig({ ...filters });
  };

  const clearFilters = () => {
    setFilterConfig({ ...INITIAL_FILTER_STATE });
  };

  const setCurrentPage = (pageNumber) => {
    setPaginationConfig((prevState) => ({ ...prevState, pageNumber: pageNumber }));
  };

  const changeTab = (tabType = 1) => {
    setDataState(INITIAL_DATA_STATE);
    setFilterConfig({ ...INITIAL_FILTER_STATE });
    setCurrentPage(1);
    setTabVariant(tabType);
  };

  return (
    <OrderContext.Provider
      value={{
        filterConfig,
        paginationConfig,
        dataState,
        isFetching,
        error,
        applyFilters,
        clearFilters,
        setCurrentPage,
        applySort,
        changeTab,
        refreshData,
        tabVariant,
        setTabVariant,
        assginedGroupsData
      }}>
      {children}
    </OrderContext.Provider>
  );
};
