import OrderService from '@src/api/commonService/OrderService';
import React, { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { ORDER_TABS, ORDER_VIEW, TAB_FILTERS } from '../pages/orders/config';
import { getDateRangeFromSelection } from '../pages/orders/dateRangeUtils';
import { DateUtils } from '@src/util/DateUtil';

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: null
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
  const [orderView, setOrderView] = React.useState(null);
  const [filterConfig, setFilterConfig] = React.useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = React.useState(
    INITIAL_PAGINATION_STATE
  );
  const [sortConfig, setSortConfig] = React.useState(INITIAL_SORT_STATE);
  const [dataState, setDataState] = React.useState(INITIAL_DATA_STATE);
  const [tabVariant, setTabVariant] = React.useState(
    ORDER_TABS.SUBMITTED_BUY_AND_BILL
  );

  const requestParams = React.useMemo(() => {
    const params = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy || 'createdAt',
      sortOrder: sortConfig.sortOrder || 'desc',
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      statuses: filterConfig.status || TAB_FILTERS[tabVariant].join(','),
      //distributionchannel: filterConfig.distributionchannel,
      ...(filterConfig?.assigneeIds && {
        assigneeIds: filterConfig.assigneeIds
      }),
      ...(filterConfig?.orderType && {
        orderType: filterConfig.orderType
      }),

      showMyOrders: orderView === ORDER_VIEW.ALL_ORDERS ? false : true
    };
    const orderDateSelection = filterConfig?.orderdate;
    if (orderDateSelection) {
      const dateRange = getDateRangeFromSelection(orderDateSelection);
      if (dateRange) {
        params.startDate = dateRange.startDate;
        params.endDate = dateRange.endDate;
      } else {
        (params.startDate = DateUtils.formatDate(
          filterConfig.dateRange[0],
          'dd/mm/yyyy'
        )),
          (params.endDate = DateUtils.formatDate(
            filterConfig.dateRange[1],
            'dd/mm/yyyy'
          ));
      }
    }

    return params;
  }, [
    filterConfig,
    paginationConfig.pageNumber,
    sortConfig,
    tabVariant,
    orderView
  ]);

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

  const { data: assignedGroupsData = {} } = useQuery({
    queryKey: ['order', 'approver-group'],
    queryFn: async () => {
      const res = await OrderService.getAssignedGroups(requestParams);
      return res;
    },
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    refreshData();
  }, [
    filterConfig,
    paginationConfig.pageNumber,
    sortConfig,
    tabVariant,
    orderView
  ]);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig({ ...filterConfig, ...filters });
    // if (filters.status && !Array.isArray(filters.status)) {
    //   filters.status = [filters.status];
    // }
  };

  const clearFilters = () => {
    setFilterConfig({ ...INITIAL_FILTER_STATE });
  };

  const setCurrentPage = (pageNumber) => {
    setPaginationConfig((prevState) => ({
      ...prevState,
      pageNumber: pageNumber
    }));
  };

  const changeTab = (tabType = ORDER_TABS.SUBMITTED_BUY_AND_BILL) => {
    setDataState(INITIAL_DATA_STATE);
    setFilterConfig({ ...INITIAL_FILTER_STATE });
    setCurrentPage(1);
    setTabVariant(tabType);
  };

  const changeOrderView = (view) => {
    setCurrentPage(1);
    setOrderView(view);
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
        assignedGroupsData: assignedGroupsData,
        orderView,
        changeOrderView
      }}>
      {children}
    </OrderContext.Provider>
  );
};
