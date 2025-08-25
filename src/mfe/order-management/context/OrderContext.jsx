import OrderService from '@src/api/commonService/OrderService';
import React from 'react';
import { useQuery } from 'react-query';
import { ORDER_TABS, ORDER_VIEW, TAB_FILTERS, TOGGLE_FILTERS } from '../pages/orders/config';
import { getDateRangeFromSelection } from '../pages/orders/dateRangeUtils';
import { DateUtils } from '@src/util/DateUtil';
import UserService from '@src/api/commonService/UserService';
import { CHANNEL_TYPE } from '../pages/create/form-segments/Constants';
import { useLocation, useNavigate } from 'react-router-dom';
import CommonUtils from '@src/util/CommonUtils';
import AuthUtils from '@src/util/AuthUtils';

const OrderContext = React.createContext();

export const useOrders = () => {
  return React.useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const navigate = useNavigate();
  const [assigneeList, setAssigneeList] = React.useState([]);
  const [assigneeRequestParams, setAssigneeRequestParams] = React.useState({
    userType: 'GENERAL'
  });

  const location = useLocation();
  const isPhysician = AuthUtils.isPhysician();
  const [config, setConfig] = React.useState({
    pageNo: 1,
    pageSize: 8,
    totalElements: 0,
    totalPages: 0,
    view: ORDER_VIEW.ALL_ORDERS,
    tab: isPhysician ? ORDER_TABS.REVIEW : ORDER_TABS.SUBMITTED_BUY_AND_BILL,
    sortBy: 'createdAt'
  });
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageNo = +params.get('page-no');
    const pageSize = +params.get('page-size');
    let view = params.get('view');
    let tab = params.get('tab');
    const sortBy = params.get('sort-by');
    const direction = params.get('direction');
    const filters = params.get('filters');

    if (tab) {
      if (isPhysician && ![ORDER_TABS.REVIEW, ORDER_TABS.SUBMITTED].includes(tab)) {
        tab = null;
      } else if (!isPhysician && !Object.values(ORDER_TABS).includes(tab)) {
        tab = null;
      }
    }

    if (!Object.values(ORDER_VIEW).includes(view)) {
      view = null;
    }

    if (!pageNo || !pageSize || !view || !tab || !sortBy || !direction) {
      if (!pageNo) params.set('page-no', 1);
      if (!pageSize) params.set('page-size', 8);
      if (!view) params.set('view', ORDER_VIEW.ALL_ORDERS);
      if (!tab) params.set('tab', isPhysician ? ORDER_TABS.REVIEW : ORDER_TABS.SUBMITTED_BUY_AND_BILL);
      if (!sortBy) params.set('sort-by', 'createdAt');
      if (!direction) params.set('direction', 'desc');
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else {
      let newConfig = {
        pageNo,
        pageSize,
        view,
        tab,
        sortBy,
        sortOrder: direction
      };
      if (filters) {
        try {
          const parsedFilters = JSON.parse(filters);
          newConfig = { ...newConfig, ...parsedFilters };
        } catch (error) {}
      }
      setConfig(newConfig);
    }
  }, [location.search]);

  const getStatuses = (config) => config.status || (config.tab && TAB_FILTERS[config.tab].join(','));

  const getChannelType = (config) => {
    if ([config.tab, config.orderType].includes(ORDER_TABS.SUBMITTED_SP)) {
      return CHANNEL_TYPE.SPECIALTY_PHARMA;
    }
    if ([config.tab, config.orderType].includes(ORDER_TABS.SUBMITTED_BUY_AND_BILL)) {
      return CHANNEL_TYPE.BUY_AND_BILL;
    }
    return null;
  };

  const getOrderDates = (config) => {
    const orderDateSelection = config?.orderDate;
    if (!orderDateSelection) return {};
    const dateRange = getDateRangeFromSelection(orderDateSelection);
    if (dateRange) {
      return {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      };
    }
    return {
      startDate: DateUtils.formatDate(config.startDate, 'dd/mm/yyyy'),
      endDate: DateUtils.formatDate(config.endDate, 'dd/mm/yyyy')
    };
  };

  const requestParams = React.useMemo(() => {
    const { totalElements, totalPages, ...rest } = config;
    return {
      ...rest,
      pageNo: Math.max(0, config.pageNo - 1),
      pageSize: config.pageSize,
      sortBy: config.sortBy || 'createdAt',
      sortOrder: config.sortOrder || 'desc',
      statuses: getStatuses(config),
      ...(config.searchQuery && { query: config.searchQuery }),
      showMyOrders: [ORDER_VIEW.MY_ORDERS, ORDER_VIEW.ASSIGNED_TO_ME].includes(config.view),
      showPAPOrders: config.view === ORDER_VIEW.PAP_ORDERS,
      ...(getChannelType(config) && { channelType: getChannelType(config) }),
      ...getOrderDates(config)
    };
  }, [config]);

  const {
    isFetching,
    refetch: refreshData,
    error,
    data
  } = useQuery({
    queryKey: ['orders', requestParams],
    queryFn: async () => {
      return isPhysician
        ? OrderService.getPhysicianOrders({ ...requestParams, reviewSubmitted: config.tab === ORDER_TABS.SUBMITTED })
        : OrderService.getOrders({ ...requestParams });
    },
    onSuccess: (result) => {
      const { totalElements, totalPages } = result;
      setConfig({
        ...config,
        totalElements,
        totalPages
      });
    },
    select: (result) => {
      result.content = CommonUtils.isNonEmptyArray(result.content)
        ? result.content.filter((i) => CommonUtils.isNonEmptyObject(i.therapy) || CommonUtils.isNonEmptyObject(i.tradeDetails))
        : result.content;
      return result;
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
    enabled: Boolean(!isPhysician && config.tab && config.tab === ORDER_TABS.PENDING_APPROVAL && config.view !== ORDER_VIEW.ASSIGNED_TO_ME)
  });

  const { data: assignedGroupsData = {} } = useQuery({
    queryKey: ['order', 'approver-group'],
    queryFn: async () => {
      const res = await OrderService.getAssignedGroups(requestParams);
      return res;
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(!isPhysician)
  });

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

  const resetAssigneeList = assigneeList.map((item) => ({
    ...item,
    isChecked: false
  }));

  return (
    <OrderContext.Provider
      value={{
        data: data?.content || [],
        isFetching,
        error,
        refreshData,
        assignedGroupsData: assignedGroupsData,
        assigneeList,
        searchAssigneeByTest,
        setAssigneeOnChange,
        config
      }}>
      {children}
    </OrderContext.Provider>
  );
};
