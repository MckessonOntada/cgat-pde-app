import OrderService from '@src/api/commonService/OrderService';
import React, { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { ORDER_TABS, ORDER_VIEW, TAB_FILTERS, TOGGLE_FILTERS } from '../pages/orders/config';
import { getDateRangeFromSelection } from '../pages/orders/dateRangeUtils';
import { DateUtils } from '@src/util/DateUtil';
import UserService from '@src/api/commonService/UserService';
import { CHANNEL_TYPE } from '../pages/create/form-segments/Constants';
import useOrderList from '../pages/orders/useOrderList';
import { useLocation, useNavigate } from 'react-router-dom';

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: null,
  orderType: 'all'
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  totalPages: 0
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null
};

const OrderContext = createContext();

export const useOrders = () => {
  return useContext(OrderContext);
};

function getChannelTypeFromOrderType(orderType) {
  if (orderType === ORDER_TABS.SUBMITTED_BUY_AND_BILL) return CHANNEL_TYPE.BUY_AND_BILL;
  if (orderType === ORDER_TABS.SUBMITTED_SP) return CHANNEL_TYPE.SPECIALTY_PHARMA;
  return null;
}

export const OrderProvider = ({ children }) => {
  const navigate = useNavigate();
  const [filterConfig, setFilterConfig] = React.useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = React.useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = React.useState(INITIAL_SORT_STATE);
  // const [tabVariant, setTabVariant] = React.useState(ORDER_TABS.SUBMITTED_BUY_AND_BILL);
  const [assigneeList, setAssigneeList] = React.useState([]);
  const [assigneeRequestParams, setAssigneeRequestParams] = React.useState({
    userType: 'GENERAL'
  });
  const [orderView, setOrderView] = React.useState(ORDER_VIEW.ALL_ORDERS);
  const [fileteredData, setfileteredData] = useState(false);

  const location = useLocation();
  // const [data, setData] = React.useState([]);
  const [config, setConfig] = React.useState({
    pageNo: 1,
    pageSize: 8,
    totalElements: 0,
    totalPages: 0,
    view: TOGGLE_FILTERS.ALL_ORDERS,
    tab: ORDER_TABS.SUBMITTED_BUY_AND_BILL,
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });
  const [filters, setFilters] = React.useState({});
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageNo = +params.get('page-no');
    const pageSize = +params.get('page-size');
    const view = params.get('view');
    const tab = params.get('tab');
    const sortBy = params.get('sort-by');
    const direction = params.get('direction');
    const filters = params.get('filters');

    if (!pageNo || !pageSize || !view || !tab || !sortBy || !direction) {
      if (!pageNo) params.set('page-no', 1);
      if (!pageSize) params.set('page-size', 8);
      if (!view) params.set('view', ORDER_VIEW.ALL_ORDERS);
      if (!tab) params.set('tab', ORDER_TABS.SUBMITTED_BUY_AND_BILL);
      if (!sortBy) params.set('sort-by', 'createdAt');
      if (!direction) params.set('direction', 'desc');
      navigate(`${location.pathname}?${params.toString()}`, { replace: false });
    } else {
      setConfig({
        ...config,
        pageNo,
        pageSize,
        view,
        tab,
        sortBy,
        sortOrder: direction
      });
    }
    if (filters) {
      try {
        const parsedFilters = JSON.parse(filters);
        setFilters(parsedFilters);
      } catch (error) {}
    } else {
      setFilters({});
    }
  }, [location.search]);

  const requestParams = React.useMemo(() => {
    const _params = {
      pageNo: config.pageNo > 0 ? config.pageNo - 1 : 0,
      pageSize: config.pageSize,
      sortBy: config.sortBy || 'createdAt',
      sortOrder: config.sortOrder || 'desc',
      statuses: filters.status || (config.tab && TAB_FILTERS[config.tab].join(',')),
      ...(filters.searchQuery && { query: filters.searchQuery }),
      ...filters,
      showMyOrders: config.view === ORDER_VIEW.MY_ORDERS || config.view === ORDER_VIEW.ASSIGNED_TO_ME ? true : false,
      showPAPOrders: Boolean(orderView === ORDER_VIEW.PAP_ORDERS),
      ...(config.tab === ORDER_TABS.SUBMITTED_SP && {
        channelType: CHANNEL_TYPE.SPECIALTY_PHARMA
      }),
      ...(config.tab === ORDER_TABS.SUBMITTED_BUY_AND_BILL && {
        channelType: CHANNEL_TYPE.BUY_AND_BILL
      })
    };

    if (_params.startDate) _params.startDate = DateUtils.formatDate(_params.startDate, 'dd/mm/yyyy');
    if (_params.endDate) _params.endDate = DateUtils.formatDate(_params.endDate, 'dd/mm/yyyy');

    return _params;
  }, [config, filters]);

  const {
    isFetching,
    refetch: refreshData,
    error,
    data
  } = useQuery({
    queryKey: ['orders', config],
    queryFn: async () => OrderService.getOrders({ ...requestParams }),
    onSuccess: (result) => {
      const { totalElements, totalPages } = result;
      setConfig({
        ...config,
        totalElements,
        totalPages
      });
    },
    onError: console.log,
    enabled: Boolean(config.pageNo) && Boolean(config.tab) && Number.isInteger(config.pageNo)
  });

  const { refetch: refreshAssignee } = useQuery({
    queryKey: ['assignee', assigneeRequestParams],
    queryFn: async () => UserService.getAssignee(assigneeRequestParams),
    onSuccess: (result = []) => {
      const alreadySelected = assigneeList.filter((item) => item.isChecked) || [];
      setAssigneeList([...alreadySelected, ...result]);
    },
    enable: Boolean(config.tab && config.tab === ORDER_TABS.PENDING_APPROVAL && config.view !== ORDER_VIEW.ASSIGNED_TO_ME)
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
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, orderView]);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const searchAssigneeByTest = (text) => {
    setAssigneeRequestParams({
      ...assigneeRequestParams,
      query: text
    });
  };

  React.useEffect(() => {
    refreshAssignee();
  }, [assigneeRequestParams]);

  const setAssigneeOnChange = (list) => {
    setAssigneeList(list);
  };

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig({ ...filterConfig, ...filters });
    setfileteredData(true);
  };

  const clearFilters = () => {
    setFilterConfig({ ...INITIAL_FILTER_STATE });
    setfileteredData(false);
  };

  const setCurrentPage = (pageNumber) => {
    setPaginationConfig((prevState) => ({
      ...prevState,
      pageNumber: pageNumber
    }));
  };
  const resetAssigneeList = assigneeList.map((item) => ({
    ...item,
    isChecked: false
  }));

  const changeTab = (tabType = ORDER_TABS.SUBMITTED_BUY_AND_BILL, shouldReset = true) => {
    if (shouldReset) {
      setAssigneeList(resetAssigneeList);
      // setDataState(INITIAL_DATA_STATE);
      setFilterConfig({ ...INITIAL_FILTER_STATE });
      setCurrentPage(1);
      setOrderView(ORDER_VIEW.ALL_ORDERS);
    }
    // setTabVariant(tabType);
  };

  const changeOrderView = (view) => {
    if (typeof view === 'string') {
      setCurrentPage(1);
      setOrderView(view);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        filterConfig,
        paginationConfig,
        data: data?.content || [],
        isFetching,
        error,
        applyFilters,
        clearFilters,
        setCurrentPage,
        applySort,
        changeTab,
        refreshData,
        assignedGroupsData: assignedGroupsData,
        orderView,
        changeOrderView,
        assigneeList,
        searchAssigneeByTest,
        setAssigneeOnChange,
        config,
        fileteredData
      }}>
      {children}
    </OrderContext.Provider>
  );
};
