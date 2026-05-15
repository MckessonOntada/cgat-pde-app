import { Button, Heading, TabList, Modal } from '@mckesson/mcp-component-library';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import Alert from '@src/components/cgat-alert/Alert';
import { CustomDataTable } from '@src/components/dataTableComponent';
import EmptyDataTable from '@src/components/EmptyTable';
import CommonFilters from '@src/components/Filters';
import TableHeading from '@src/components/tableHeading/TableHeading';
import useAlert from '@src/hooks/useAlert';
import usePermission from '@src/hooks/usePermissions';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import { useTranslate } from '@src/translations/useTranslation';
import AuthUtils from '@src/util/AuthUtils';
import CommonUtils from '@src/util/CommonUtils';
import { DateUtils } from '@src/util/DateUtil';
import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import ModuleHeader from '../../../../components/module-header';
import TabGroup from '../../../../components/tab-group';
import Tab from '../../../../components/tab-group/Tab';
import { useOrders } from '../../context/OrderContext';
import { routesConfig } from './../../routes/constants';
import { getTabs, ORDER_DATE_FILTER_OPTIONS, ORDER_STATUS, ORDER_TABS, ORDER_VIEW, TOGGLE_FILTERS } from './config';
import LayoutColumnSelector from './LayoutColumnSelector';
import { getLayoutColumns } from './layoutColumnsUtils';
import { getTableColumns } from './TableColumns';
import CancelOrderPanel from '../create/form-segments/summary/CancelOrderPanel';
import { ReactComponent as ButtonLoadingIcon } from '@src/assets/svg/button-loading.svg';
import OrderService from '@src/api/commonService/OrderService';
import { useWidgetContext } from '@src/context/WidgetContext';
import { CHANNEL_TYPE } from '../create/form-segments/Constants';

const OrderIndex = ({ isCSReviewOrdersPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [isCancelOrderPanelOpen, setIsCancelOrderPanelOpen] = React.useState(false);
  const [isCancelOrderConfirmationOpen, setIsCancelOrderConfirmationOpen] = React.useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = React.useState(false);
  const [cancelOrderReason, setCancelOrderReason] = React.useState(null);
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const { t } = useTranslate();
  const { state, setValue } = useWidgetContext();
  const [alert, setAlert] = useState(null);
  const { hasPermission } = usePermission();
  const hasCreatePermissions = hasPermission(PERMISSIONS_ENUM.CREATE_NEW_ORDER.THERAPY_SELECTION);

  const [tabList, setTabList] = useState(() => {
    const allTabs = getTabs(isCSReviewOrdersPage);
    allTabs.forEach((tab) => {
      tab.configName = t(tab.configName);
      tab.labelForMobile = t(tab.labelForMobile);
    });
    return allTabs;
  });

  React.useEffect(() => {
    setValue('orderDetails', {});
  }, []);

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

  const { assigneeList, error, searchAssigneeByTest, data, isFetching, config, refreshData } = useOrders();
  const activeTab = tabList.find((tab) => tab.id === config.tab);
  const { showAlert } = useAlert();
  const alertContainerId = 'summary-alert-container';

  const handleApplyFilters = (filters) => {
    params.set('page-no', 1);
    const searchParams = {
      searchQuery: filters.searchQuery
    };

    if (config.tab === ORDER_TABS.SUBMITTED_BUY_AND_BILL) {
      searchParams.orderDate = filters.orderDate;
      searchParams.startDate = filters.dateRange?.[0];
      searchParams.endDate = filters.dateRange?.[1];
      searchParams.status = filters.status;
    } else if (config.tab === ORDER_TABS.SUBMITTED_SP) {
      searchParams.orderDate = filters.orderDate;
      searchParams.startDate = filters.dateRange?.[0];
      searchParams.endDate = filters.dateRange?.[1];
      searchParams.status = filters.status;
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

    searchParams['page-no'] = 1;

    const cleanedParams = {};
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        cleanedParams[key] = value;
      }
    });
    params.set('filters', JSON.stringify(cleanedParams));
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleClearFilters = () => {
    params.delete('filters');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleOnTabChange = (newTab) => {
    if (activeTab.id === newTab.id) return;

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
    let tabId = params.get('tab');
    const isCustomerCenterView = AuthUtils.isCustomerCenterView();
    if (isCustomerCenterView) {
      tabId = AuthUtils.getCSUserChannelType() === CHANNEL_TYPE.BUY_AND_BILL ? ORDER_TABS.SUBMITTED_BUY_AND_BILL : ORDER_TABS.SUBMITTED_SP;
    } else if (!tabId) {
      tabId = isPhysician ? ORDER_TABS.REVIEW : ORDER_TABS.SUBMITTED_BUY_AND_BILL;
    }

    setTabList(
      tabList.map((tab) => ({
        ...tab,
        isActiveTab: tab.id === tabId
      }))
    );
    params.set('tab', tabId);
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  }, [location.search]);

  React.useEffect(() => {
    const alert = location.state?.alert;
    if (alert) {
      setAlert({ type: alert.type, description: alert.description });
      navigate('/orders', { replace: true });
    }
  }, [location]);

  const handleOnCreateNewOrder = () => {
    if (!hasCreatePermissions) {
      setAlert({ type: 'error', description: 'You are not authorized to place this order. Please contact your Organization Administrator for assistance' });
    } else {
      navigate(`${routesConfig.createOrder}`, {
        state: { __prevSearch: location.search || '' }
      });
    }
  };

  React.useEffect(() => {
    if (error) {
      const description = CommonUtils.getUploadErrorMessage({}, t);
      showAlert({
        description: description,
        type: 'error',
        anchorEl: alertContainerId
      });
    }
  }, [error]);

  const toggleFilters = TOGGLE_FILTERS[config.tab];

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
  const handleOnCancelOrder = (props) => {
    setSelectedOrder(props);
    setIsCancelOrderPanelOpen(true);
  };

  const cancelOrder = () => {
    setIsCancellingOrder(true);
    OrderService.cancelOrder(selectedOrder?.id, selectedOrder.practiceId, cancelOrderReason)
      .then((response) => {
        refreshData();
        setAlert({
          type: 'success',
          description: 'Your order has been successfully cancelled.'
        });
      })
      .catch((error) => {
        setAlert({
          type: 'error',
          description: 'Something went wrong. Please try again.'
        });
      })
      .finally(() => {
        setCancelOrderReason(null);
        setIsCancelOrderConfirmationOpen(false);
        setIsCancellingOrder(false);
        setSelectedOrder(null);
      });
  };

  const { data: columnPreferenceData, refetch: refetchColumnPreference } = useQuery({
    queryKey: ['column-preference', AuthUtils.getUserId()],
    queryFn: () => OrderService.getColumnPreference(),
    refetchOnWindowFocus: false
  });

  const layoutColumns = useMemo(() => getLayoutColumns(columnPreferenceData, config.tab, t), [columnPreferenceData, config.tab, t]);

  const [appliedLayoutKeys, setAppliedLayoutKeys] = useState(() => layoutColumns.filter((c) => c.defaultChecked).map((c) => c.key));

  React.useEffect(() => {
    setAppliedLayoutKeys(layoutColumns.filter((c) => c.defaultChecked).map((c) => c.key));
  }, [layoutColumns]);

  const { mutate: saveColumnPreference } = useMutation({
    mutationFn: (payload) => OrderService.saveColumnPreference(payload),
    onSuccess: () => {
      refetchColumnPreference();
      setAlert({ type: 'success', description: t('messages.layout.applySuccess') });
    },
    onError: () => {
      setAlert({ type: 'error', description: t('messages.layout.applyError') });
    }
  });

  const handleLayoutApply = (checkedKeys) => {
    if (!columnPreferenceData) return;
    setAppliedLayoutKeys(checkedKeys);
    const modifiedConfig = Object.fromEntries(
      Object.entries(columnPreferenceData).map(([section, cols]) => [
        section,
        cols.map((col) => ({
          ...col,
          visibility: col.mandatory ? col.visibility : checkedKeys.includes(col.columnName)
        }))
      ])
    );
    saveColumnPreference(modifiedConfig);
  };

  const columns = getTableColumns(config.tab, t, alertContainerId, isCSReviewOrdersPage, handleOnCancelOrder, appliedLayoutKeys);

  const handleOnViewChange = (view) => {
    params.set('view', view);
    params.set('page-no', 1);
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  const currentTab = tabList.find((tab) => tab?.['isActiveTab']) || {};

  const additionalFiltersConfig = useMemo(() => {
    const filters = [];
    let searchPlaceholder = 'controls.placeholder.searchOrderPlaceholder';

    switch (config.tab) {
      case ORDER_TABS.SUBMITTED_SP: {
        if (isCSReviewOrdersPage) {
          searchPlaceholder = 'controls.placeholder.searchSPCSReviewAdminPlaceholder';
        } else {
          searchPlaceholder = 'controls.placeholder.searchSPOrderPlaceholder';
        }
        const statusOptions = [ORDER_STATUS.ALL, ORDER_STATUS.SUBMITTED, ORDER_STATUS.OPEN, ORDER_STATUS.CS_REVIEW, ORDER_STATUS.CANCELLED];
        filters.push({
          type: 'dropdown',
          name: 'status',
          label: t('userManagement.table.status'),
          options: statusOptions.map((opt) => ({
            label: t(`labels.caption.${opt}`),
            value: opt
          }))
        });
        break;
      }

      case ORDER_TABS.REVIEW: {
        searchPlaceholder = 'controls.placeholder.searchReviewOrderPlaceholder';
        return { availableFilters: [], searchPlaceholder };
      }
      case ORDER_TABS.SUBMITTED: {
        searchPlaceholder = 'controls.placeholder.searchReviewOrderPlaceholder';
        return { availableFilters: [], searchPlaceholder };
      }
      case ORDER_TABS.SUBMITTED_BUY_AND_BILL: {
        if (AuthUtils.hasUserPhiPermission() && !isCSReviewOrdersPage) searchPlaceholder = 'controls.placeholder.searchReviewOrderPlaceholder';
        else if (isCSReviewOrdersPage) {
          searchPlaceholder = 'controls.placeholder.searchCSReviewAdminPlaceholder';
        } else searchPlaceholder = 'controls.placeholder.searchNonPhiOrderPlaceholder';
        const statusOptions = [
          ORDER_STATUS.ALL,
          ORDER_STATUS.SUBMITTED,
          ORDER_STATUS.OPEN,
          ORDER_STATUS.CS_REVIEW,
          ORDER_STATUS.CANCELLED,
          ORDER_STATUS.COMPLETED
        ];

        filters.push({
          type: 'dropdown',
          name: 'status',
          label: t('userManagement.table.status'),
          options: statusOptions.map((opt) => ({
            label: t(`labels.caption.${opt}`),
            value: opt
          }))
        });
        filters.push({
          type: 'dropdown',
          name: 'orderDate',
          label: currentTab.id === ORDER_TABS.SUBMITTED_SP ? 'Prescription Date' : 'Order Date',
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
                    required: true,
                    maxDate: new Date()
                  }
                ]
              : []
        });
        return { availableFilters: filters, searchPlaceholder };
      }

      case ORDER_TABS.PENDING_SUBMISSION: {
        const statusOptions = [ORDER_STATUS.ALL, ORDER_STATUS.IN_DRAFT, ORDER_STATUS.DELETED, ORDER_STATUS.REJECTED, ORDER_STATUS.REVIEW];
        filters.push({
          type: 'dropdown',
          name: 'status',
          label: t('userManagement.table.status'),
          options: statusOptions.map((opt) => ({
            label: t(`labels.caption.${opt}`),
            value: opt
          }))
        });
      }

      case ORDER_TABS.PENDING_APPROVAL: {
        const orderTypes = ['all', ORDER_TABS.SUBMITTED_BUY_AND_BILL, ORDER_TABS.SUBMITTED_SP];
        filters.push({
          type: 'dropdown',
          name: 'orderType',
          label: t('labels.orderType'),
          options: orderTypes.map((opt) => ({
            label: t(`labels.caption.${opt}`),
            value: opt
          }))
        });

        if (config.tab === ORDER_TABS.PENDING_APPROVAL && config.view === ORDER_VIEW.ALL_ORDERS) {
          filters.push({
            type: 'multiSelectDropdown',
            name: 'assigneeIds',
            isMultiSelect: true,
            placeholder: t('placeholder.selectAssignee'),
            label: t('labels.assignee'),
            options: assigneeList.map((t) => ({
              ...t,
              isChecked: assigneeIdsFromURL.includes(t.value)
            })),
            variant: 'async',
            onSearch: searchAssigneeByTest,
            recordsCountToEnableSearch: 2
          });
        }
        break;
      }

      default:
        break;
    }

    if (config.tab !== ORDER_TABS.PENDING_APPROVAL) {
      filters.push({
        type: 'dropdown',
        name: 'orderDate',
        label: currentTab.id === ORDER_TABS.SUBMITTED_SP ? 'Prescription Date' : 'Order Date',
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
                  required: true,
                  maxDate: new Date()
                }
              ]
            : []
      });
    }

    return {
      availableFilters: filters,
      searchPlaceholder
    };
  }, [location.search, config.tab, assigneeList, assigneeIdsFromURL]);

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

  const isCardExpanded = React.useMemo(() => {
    const { searchQuery, ...rest } = initialFilterData;
    if (Object.keys(rest).length > 0) return true;

    return false;
  }, [location.search]);

  const isPhysician = AuthUtils.isPhysician();

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t(isPhysician ? 'headings.prescription' : 'headings.orders')}</Heading>}
          controls={
            !isPhysician &&
            !isCSReviewOrdersPage && (
              <div className="controls">
                <Button Icon={AddCircleFilled} className="button-icon" onClick={handleOnCreateNewOrder} size="lg" aria-label={t('controls.createNewOrder')}>
                  {t('controls.ariaLabels.createNewOrder')}
                </Button>
              </div>
            )
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
                autoFocus={true}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                additionalFilters={additionalFiltersConfig.availableFilters}
                onLoadExpanded={isCardExpanded}
                searchPlaceholder={t(additionalFiltersConfig.searchPlaceholder)}
                initialData={initialFilterData}
              />
            </div>

            <div className="MCP-table-wrapper">
              <ModuleHeader
                heading={
                  <TableHeading
                    heading={t(isPhysician || currentTab.id === ORDER_TABS.SUBMITTED_SP ? 'table.ariaLabel.prescriptionList' : 'table.ariaLabel.orderList')}
                  />
                }
                controls={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!isCSReviewOrdersPage && CommonUtils.isNonEmptyArray(toggleFilters) && (
                      <TabGroup value={config.view} onChange={handleOnViewChange} exclusive>
                        {toggleFilters.map((filter, index) => (
                          <Tab key={index} value={filter}>
                            {t(isPhysician || currentTab.id === ORDER_TABS.SUBMITTED_SP ? `labels.orderView.SP_${filter}` : `labels.orderView.${filter}`)}
                          </Tab>
                        ))}
                      </TabGroup>
                    )}
                    {!isPhysician && <LayoutColumnSelector columns={layoutColumns} onApply={handleLayoutApply} />}
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
                    heading={
                      Boolean(filterParams)
                        ? t('errors.messages.noRecordsFound')
                        : isPhysician
                        ? t('captions.noPrescriptionFound')
                        : t('captions.emptyTableTitle')
                    }
                    description={
                      !Boolean(filterParams) && isPhysician
                        ? t('captions.noPrescriptionFoundSubtitle')
                        : !Boolean(filterParams)
                        ? t('captions.emptyTableSubtitle')
                        : null
                    }
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
      {isCancelOrderPanelOpen && (
        <CancelOrderPanel
          readOnly={false}
          meta={{ orderId: selectedOrder?.id, isSpOrder: false }}
          onSuccess={(reason) => {
            setIsCancelOrderPanelOpen(false);
            setIsCancelOrderConfirmationOpen(true);
            setCancelOrderReason(reason);
          }}
          onClose={() => {
            setIsCancelOrderPanelOpen(false);
            setSelectedOrder(null);
          }}
          openDrawer={isCancelOrderPanelOpen}
        />
      )}
      {isCancelOrderConfirmationOpen && (
        <Modal
          id="cancel-order-confirmation-modal"
          isOpen={isCancelOrderConfirmationOpen}
          onClose={() => setIsCancelOrderConfirmationOpen(false)}
          modalTitle={'Cancel Order'}
          modalBody={
            <div className="MCP-modal-body">
              <p>Are you sure you want to cancel this order?</p>
            </div>
          }
          modalFooter={
            <div className="controls">
              <Button size="md" variant="secondary" onClick={() => setIsCancelOrderConfirmationOpen(false)}>
                No
              </Button>
              <Button
                variant="primary"
                onClick={cancelOrder}
                isLoadingState={isCancellingOrder}
                Icon={isCancellingOrder && ButtonLoadingIcon}
                iconPosition="left"
                type="submit"
                size="md">
                {isCancellingOrder ? 'Cancelling' : 'Yes'}
              </Button>
            </div>
          }
          modalSize="md"
        />
      )}
    </div>
  );
};

export default OrderIndex;
