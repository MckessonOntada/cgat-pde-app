import React, { useState, useEffect, useMemo } from 'react';
import { TabList, Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { routesConfig } from './../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '../../../../components/module-header';
import CommonFilters from '@src/components/Filters';
import { useOrders } from '../../context/OrderContext';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import PermittedComponent from '@src/components/permitted-component';
import { getTabs, ORDER_DATE_FILTER_OPTIONS, ORDER_STATUS, ORDER_TABS, ORDER_VIEW, TOGGLE_FILTERS } from './config';
import useAlert from '@src/hooks/useAlert';
import { handleApiError } from '@src/util/ApiUtils';
import Alert from '@src/components/cgat-alert/Alert';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { getTableColumns } from './TableColumns';
import TableHeading from '@src/components/tableHeading/TableHeading';
import ToggleButtonGroup from './ToggleButtonGroup';
import ToggleButton from './ToggleButton';
import { CustomDataTable } from '@src/components/dataTableComponent';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { DateUtils } from '@src/util/DateUtil';

const OrderIndex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { t } = useTranslate();
  const [alert, setAlert] = useState(null);
  const [tabList, setTabList] = useState(() => {
    const allTabs = getTabs();
    allTabs.forEach((tab) => {
      tab.configName = t(tab.configName);
      tab.labelForMobile = t(tab.labelForMobile);
    });
    return allTabs;
  });

  const filterParams = params.get('filters');
  let assigneeIdsFromURL = React.useMemo(() => {
    try {
      const parsedFilters = JSON.parse(filterParams);
      if (parsedFilters.assigneeIds) {
        parsedFilters.assigneeIds = parsedFilters.assigneeIds.split(',').map((t) => Number(t));
        return parsedFilters.assigneeIds;
      }
    } catch (error) {}
    return [];
  }, [location.search]);

  const {
    applyFilters,
    changeTab,
    orderView,
    assigneeList,
    error,
    searchAssigneeByTest,
    setAssigneeOnChange,
    filterConfig,
    changeOrderView,
    data,
    isFetching,
    config,
    fileteredData
  } = useOrders();

  const activeTab = tabList.find((tab) => tab.id === config.tab);
  const { showAlert } = useAlert();
  const alertContainerId = 'summary-alert-container';

  useEffect(() => {
    try {
      const parsedFilters = JSON.parse(filterParams);
      if (parsedFilters.startDate) parsedFilters.startDate = DateUtils.formatDate(parsedFilters.startDate, 'mm/dd/yyyy');
      if (parsedFilters.endDate) parsedFilters.endDate = DateUtils.formatDate(parsedFilters.endDate, 'mm/dd/yyyy');
      parsedFilters.dateRange = [parsedFilters.startDate || '', parsedFilters.endDate || ''];
      if (parsedFilters.assigneeIds) {
        parsedFilters.assigneeIds = parsedFilters.assigneeIds.split(',');
      }
      const hasFilter = Object.values(parsedFilters).some((val) => val !== '' && val !== null && !(Array.isArray(val) && val.length === 0));

      if (hasFilter) applyFilters(parsedFilters);
    } catch (error) {}
  }, []);

  const handleApplyFilters = (filters) => {
    const searchParams = {
      searchQuery: filters.searchQuery
    };
    if (config.tab === ORDER_TABS.SUBMITTED_BUY_AND_BILL) {
      searchParams.orderDate = filters.orderDate;
      searchParams.startDate = filters.dateRange?.[0];
      searchParams.endDate = filters.dateRange?.[1];
    } else if (config.tab === ORDER_TABS.SUBMITTED_SP) {
      searchParams.orderDate = filters.orderDate;
      searchParams.startDate = filters.dateRange?.[0];
      searchParams.endDate = filters.dateRange?.[1];
    } else if (config.tab === ORDER_TABS.PENDING_SUBMISSION) {
      searchParams.orderType = filters.orderType;
      searchParams.orderDate = filters.orderDate;
      searchParams.startDate = filters.dateRange?.[0];
      searchParams.status = filters.status;
      searchParams.endDate = filters.dateRange?.[1];
    } else if (config.tab === ORDER_TABS.PENDING_APPROVAL) {
      searchParams.orderType = filters.orderType;
      searchParams.assigneeIds = filters.assigneeIds?.join(',');
    }

    const cleanedParams = {};
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        cleanedParams[key] = value;
      }
    });
    params.set('filters', JSON.stringify(cleanedParams));
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  const handleClearFilters = () => {
    params.delete('filters');
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  const handleOnTabChange = (newTab) => {
    params.set('tab', newTab.id);
    params.set('page-no', 1);
    params.set('sort-by', 'createdAt');
    params.set('direction', 'desc');
    params.delete('filters');

    const isExistingViewAvailable = TOGGLE_FILTERS[newTab.id]?.includes(config.view);
    if (!isExistingViewAvailable) {
      const defaultView = TOGGLE_FILTERS[config.tab][0];
      params.set('view', defaultView);
    }

    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  React.useEffect(() => {
    const tabId = params.get('tab') || ORDER_TABS.SUBMITTED_BUY_AND_BILL;
    const newTabs = tabList.map((tab) => ({ ...tab, isActiveTab: tab.id === tabId }));
    setTabList(newTabs);
    changeTab(tabId, true);
  }, [location.search]);

  React.useEffect(() => {
    const alert = location.state?.alert;
    if (alert) {
      setAlert({ type: alert.type, description: alert.description });
      navigate('/orders', { replace: true });
    }
  }, [location]);

  const handleOnCreateNewOrder = () => {
    navigate(`${routesConfig.createOrder}`, {
      state: { __prevSearch: location.search || '' }
    });
  };

  useEffect(() => {
    if (error) {
      showAlert({
        description: t(handleApiError(error)),
        type: 'error',
        anchorEl: alertContainerId
      });
    }
  }, [error]);

  const toggleFilters = TOGGLE_FILTERS[config.tab];
  useEffect(() => {
    changeOrderView(() => toggleFilters && Array.isArray(toggleFilters) && toggleFilters[0]);
  }, [config.tab]);

  const showCardView = useResponsiveView();

  const handleOnPageChange = (_event, pageIndex) => {
    params.set('page-no', pageIndex);
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) {
      params.set('sort-by', selectedColumn.sortKey);
      params.set('direction', sortDirection);
      navigate(`${location.pathname}?${params.toString()}`, { replace: false });
    }
  };

  const columns = getTableColumns(config.tab, t, alertContainerId);

  const handleOnViewChange = (view) => {
    params.set('view', view);
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  useEffect(() => {
    const tab = params.get('tab');
    if (!tab) {
      params.set('tab', ORDER_TABS.SUBMITTED_BUY_AND_BILL);
      navigate(`${location.pathname}?${params.toString()}`, { replace: false });
    }
  }, [location.search]);

  const currentTab = tabList.find((tab) => tab?.['isActiveTab']) || {};

  const additionalFiltersConfig = useMemo(() => {
    let filters = [];

    if (config.tab === ORDER_TABS.PENDING_SUBMISSION) {
      const options = [ORDER_STATUS.ALL, ORDER_STATUS.IN_DRAFT, ORDER_STATUS.DELETED, ORDER_STATUS.REJECTED];
      filters.push({
        type: 'dropdown',
        name: 'status',
        label: t('userManagement.table.status'),
        options: options.map((opt) => ({ label: t(`labels.caption.${opt}`), value: opt }))
      });
    }

    if ([ORDER_TABS.PENDING_APPROVAL, ORDER_TABS.PENDING_SUBMISSION].includes(config.tab)) {
      const orderTypes = ['all', ORDER_TABS.SUBMITTED_BUY_AND_BILL, ORDER_TABS.SUBMITTED_SP];
      filters.push({
        type: 'dropdown',
        name: 'orderType',
        label: t('labels.orderType'),
        options: orderTypes.map((opt) => ({ label: t(`labels.caption.${opt}`), value: opt }))
      });

      if (orderView === ORDER_VIEW.ALL_ORDERS && config.tab === ORDER_TABS.PENDING_APPROVAL) {
        filters.push({
          type: 'multiSelectDropdown',
          name: 'assigneeIds',
          isMultiSelect: true,
          placeholder: t('placeholder.selectAssignee'),
          label: t('labels.assignee'),
          options: assigneeList.map((t) => ({ ...t, isChecked: assigneeIdsFromURL.includes(t.value) })),
          variant: 'async',
          onSearch: searchAssigneeByTest,
          recordsCountToEnableSearch: 2,
          getUpdatedOptions: (e) => {
            if (assigneeIdsFromURL?.length === 0 && e?.length > 0) {
              setAssigneeOnChange(e);
            }
          }
        });
      }
    }

    if (config.tab !== ORDER_TABS.PENDING_APPROVAL) {
      filters.push({
        type: 'dropdown',
        name: 'orderDate',
        label: 'Order Date',
        options: ORDER_DATE_FILTER_OPTIONS.map((opt) => ({ label: t(`labels.caption.${opt.value}`), value: opt.value })),
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
  }, [activeTab, orderView, location]);

  const initialFilterData = React.useMemo(() => {
    if (filterParams) {
      try {
        const parsedFilters = JSON.parse(filterParams);
        if (parsedFilters.startDate) parsedFilters.startDate = DateUtils.formatDate(parsedFilters.startDate, 'mm/dd/yyyy');
        if (parsedFilters.endDate) parsedFilters.endDate = DateUtils.formatDate(parsedFilters.endDate, 'mm/dd/yyyy');
        if (parsedFilters.assigneeIds) {
          parsedFilters.assigneeIds = parsedFilters.assigneeIds.split(',').map((t) => Number(t));
        }

        parsedFilters.dateRange = [parsedFilters.startDate, parsedFilters.endDate];
        return parsedFilters;
      } catch (error) {}
    }
    return {};
  }, [location.search]);

  console.log(assigneeList);

  const isCardExpanded = React.useMemo(() => {
    const { searchQuery, ...rest } = initialFilterData;
    if (Object.keys(rest).length > 0) return true;

    return false;
  }, [location.search]);

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('headings.orders')}</Heading>}
          controls={
            <div className="controls">
              <PermittedComponent permissions={PERMISSIONS_ENUM.ORDER_MANAGEMENT.ADD_ORDERS}>
                <Button Icon={AddCircleFilled} className="button-icon" onClick={handleOnCreateNewOrder} size="lg" aria-label={t('controls.createNewOrder')}>
                  {t('controls.ariaLabels.createNewOrder')}
                </Button>
              </PermittedComponent>
            </div>
          }
        />

        <div id={alertContainerId} />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

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
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                additionalFilters={additionalFiltersConfig}
                onLoadExpanded={isCardExpanded}
                searchPlaceholder={t(
                  config.tab === ORDER_TABS.SUBMITTED_SP ? 'controls.placeholder.searchSPOrderPlaceholder' : 'controls.placeholder.searchOrderPlaceholder'
                )}
                initialData={initialFilterData}
              />
            </div>

            <div className="MCP-table-wrapper">
              <ModuleHeader
                heading={<TableHeading heading={t('table.ariaLabel.orderList')} />}
                controls={
                  <div>
                    <ToggleButtonGroup value={config.view} onChange={handleOnViewChange} exclusive>
                      {toggleFilters.map((filter, index) => (
                        <ToggleButton key={index} value={filter}>
                          {t(`labels.orderView.${filter}`)}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </div>
                }
              />

              <CustomDataTable
                id="order-management-order-listing"
                type={'normal'}
                columns={columns}
                data={data}
                handleChangePage={handleOnPageChange}
                onSortIconClick={handleOnSort}
                pagination={true}
                currentPage={Number(config.pageNo)}
                totalPageCount={config.totalPages}
                totalRocords={config.totalElements}
                recordsPerPage={8}
                aria-label={t('table.ariaLabel.orderList')}
                paginationRecordsPerPageMessage={t('labels.perPage')}
                paginationTotalRecorsMessage={t('labels.results')}
                showCardView={showCardView}
                defaultExpandedCardView={false}
                noDataComponent={
                  <EmptyDataTable
                    isLoading={isFetching}
                    error={error && error.message}
                    image={EmptyDataImage}
                    heading={!fileteredData ? t('captions.emptyTableTitle') : t('errors.messages.noRecordsFound')}
                    description={!fileteredData && t('captions.emptyTableSubtitle')}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderIndex;
