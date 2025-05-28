import React from 'react';
import { TabList, Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { routesConfig } from './../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '../../../../components/module-header';
import OrderDataTable from './OrderDataTable';
import CommonFilters from '@src/components/Filters';
import { useOrders } from '../../context/OrderContext';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import PermittedComponent from '@src/components/permitted-component';
import {
  getTabs,
  ORDER_DATE_FILTER_OPTIONS,
  ORDER_STATUS,
  ORDER_TABS,
  ORDER_VIEW
} from './config';
import useAlert from '@src/hooks/useAlert';
import { handleApiError } from '@src/util/ApiUtils';
import CommonUtils from '@src/util/CommonUtils';
import Alert from '@src/components/cgat-alert/Alert';

const OrderIndex = () => {
  const { t } = useTranslate();
  const [_isOrderCountAdded, setIsOrderCountAdded] = React.useState(false);
  const {
    applyFilters,
    clearFilters,
    changeTab,
    tabVariant,
    orderView,
    isError,
    assigneeList,
    error,
    searchAssigneeByTest,
    setAssigneeOnChange
  } = useOrders();
  const [alert, setAlert] = React.useState(null);
  const [tabList, setTabList] = React.useState(() => {
    const allTabs = getTabs();
    allTabs.forEach((tab) => {
      tab.configName = t(tab.configName);
      tab.labelForMobile = t(tab.labelForMobile);
    });
    return allTabs;
  });

  const orderCounts = {}; // useOrderCount();
  React.useEffect(() => {
    if (
      !_isOrderCountAdded &&
      orderCounts &&
      CommonUtils.isNonEmptyObject(orderCounts)
    ) {
      const allTabs = getTabs();
      allTabs.forEach((tab) => {
        tab.configName = t(tab.configName);
      });
      setTabList(allTabs);
    }
    if (orderCounts && CommonUtils.isNonEmptyObject(orderCounts)) {
      setIsOrderCountAdded(true);
    }
  }, [orderCounts]);

  const navigate = useNavigate();
  const location = useLocation();
  const activeTabFromState = location.state?.activeTab;
  const activeTab = tabList.find((tab) => tab.id === tabVariant);
  const { showAlert } = useAlert();
  const alertContainerId = 'summary-alert-container';

  const additionalFiltersConfig = React.useMemo(() => {
    let filters = [];

    if (tabVariant === ORDER_TABS.PENDING_SUBMISSION) {
      const options = [
        ORDER_STATUS.ALL,
        ORDER_STATUS.IN_DRAFT,
        ORDER_STATUS.DELETED,
        ORDER_STATUS.REJECTED
      ];

      filters.push({
        type: 'dropdown',
        name: 'status',
        label: t('userManagement.table.status'),
        options: options.map((opt) => ({
          label: t(`labels.caption.${opt}`),
          value: opt
        }))
      });
    }
    if (
      tabVariant === ORDER_TABS.PENDING_APPROVAL ||
      tabVariant === ORDER_TABS.PENDING_SUBMISSION
    ) {
      const orderTypes = [
        'All',
        ORDER_TABS.SUBMITTED_BUY_AND_BILL,
        ORDER_TABS.SUBMITTED_SP
      ];
      filters.push({
        type: 'dropdown',
        name: 'orderType',
        label: t('labels.orderType'),
        options: orderTypes.map((opt) => ({
          label: t(`labels.caption.${opt}`),
          value: opt
        }))
      });
      if (orderView === ORDER_VIEW.ALL_ORDERS) {
        filters.push({
          type: 'multiSelectDropdown',
          name: 'assigneeIds',
          isMultiSelect: true,
          placeholder: t('placeholder.selectAssignee'),
          label: t('labels.assignee'),
          options: assigneeList,
          variant: 'async',
          onSearch: searchAssigneeByTest,
          recordsCountToEnableSearch: 2,
          getUpdatedOptions: (e) => {
            if (e.length > 0) {
              setAssigneeOnChange(e);
            }
          },
          size: 'lg'
        });
      }
    }

    if (tabVariant !== ORDER_TABS.PENDING_APPROVAL) {
      filters.push({
        type: 'dropdown',
        name: 'orderDate',
        label: 'Order Date',
        options: ORDER_DATE_FILTER_OPTIONS.map((opt) => ({
          label: t(`labels.caption.${opt.value}`),
          value: opt.value
        })),
        linkedFilters: (value) =>
          value === 'customRange'
            ? [
                {
                  type: 'dateRangePicker',
                  name: 'dateRange',
                  startDateLabel: t('labels.startDate'),
                  endDateLabel: t('labels.endDate'),
                  required: true
                }
              ]
            : []
      });
    }
    return filters;
  }, [activeTab, orderView, assigneeList]);

  const handleOnTabChange = (newTab) => {
    const newTabs = tabList.map((tab) => ({
      ...tab,
      isActiveTab: tab.id === newTab.id
    }));
    setTabList(newTabs);
    changeTab(newTab.id);
  };

  React.useEffect(() => {
    const alert = location.state?.alert;
    if (alert) {
      setAlert({
        type: alert.type,
        description: alert.description
      });
      navigate('/orders', { replace: true });
    }
  }, [location]);

  const handleOnClick = () => {
    navigate(routesConfig.createOrder);
  };

  React.useEffect(() => {
    if (activeTabFromState) {
      tabList.forEach((tab) => {
        tab.isActiveTab = tab.id === activeTabFromState;
      });
      setTabList(tabList);
      changeTab(activeTabFromState);
    }
  }, [activeTabFromState]);

  React.useEffect(() => {
    if (error) {
      console.log(error);
      showAlert({
        description: t(handleApiError(error)),
        type: 'error',
        anchorEl: alertContainerId
      });
    }
  }, [error]);

  const currentTab =
    (tabList && tabList.find((tab) => tab?.['isActiveTab'])) || {};

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('headings.orders')}</Heading>}
          controls={
            <div className="controls">
              <PermittedComponent
                permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.ADD_ORDERS}>
                <Button
                  Icon={AddCircleFilled}
                  className="button-icon"
                  onClick={handleOnClick}
                  size="lg"
                  aria-label={t('controls.createNewOrder')}>
                  {t('controls.ariaLabels.createNewOrder')}
                </Button>
              </PermittedComponent>
            </div>
          }
        />
        <div id={alertContainerId} />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        {/* add alert here */}

        <div className="MCP-module-body">
          <div className="MCP-panel-container">
            <div className="customTab">
              <TabList
                options={tabList}
                alignment="left"
                onTabClick={handleOnTabChange}
                showShadow={false}
                variant={'text'}
                useAsButton={true}
                aria-label={t('controls.ariaLabels.orderTabList')}
              />
            </div>
            <div className="MCP-CardContainer" key={currentTab.id}>
              <CommonFilters
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
                additionalFilters={additionalFiltersConfig}
                searchPlaceholder={t(
                  tabVariant === ORDER_TABS.SUBMITTED_SP
                    ? 'controls.placeholder.searchSPOrderPlaceholder'
                    : 'controls.placeholder.searchOrderPlaceholder'
                )}
              />
            </div>
            <div className="MCP-table-wrapper">
              <OrderDataTable
                tab={activeTab && activeTab.id}
                alertContainerId={alertContainerId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderIndex;
