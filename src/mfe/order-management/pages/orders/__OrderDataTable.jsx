import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CustomDataTable } from '../../../../components/dataTableComponent';
import { useOrders } from '../../context/OrderContext';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import './OrderDataTable.module.scss';
import useResponsiveView from '@src/hooks/useResponsiveView';
import TableHeading from '@src/components/tableHeading/TableHeading';
import ModuleHeader from '@src/components/module-header';
import { getTableColumns } from './TableColumns';
import ToggleButtonGroup from './ToggleButtonGroup';
import ToggleButton from './ToggleButton';
import { ORDER_TABS, ORDER_VIEW, TOGGLE_FILTERS } from './config';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderDataTable = ({ tab, alertContainerId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const toggleFilters = TOGGLE_FILTERS[tab];
  React.useEffect(() => {
    changeOrderView(() => {
      return toggleFilters && Array.isArray(toggleFilters) && toggleFilters[0];
    });
  }, [tab]);
  const { t } = useTranslate();
  const {
    dataState: data,
    paginationConfig,
    isFetching,
    error,
    setCurrentPage,
    applySort,
    refreshData,
    orderView,
    changeOrderView,
    fileteredData
  } = useOrders();

  // const columns = createColumns(t, navigate, tab, alertContainerId, calculateMinWidth, setCharSize);
  const showCardView = useResponsiveView();

  const handleOnPageChange = (_event, pageIndex) => {
    const params = new URLSearchParams(location.search);
    params.set('pageNo', pageIndex);
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageNo = params.get('pageNo');
    const pageSize = params.get('pageSize');
    const view = params.get('view');
    const tab = params.get('tab');

    // check if required params are there else adding and then navigating
    if (!pageNo || !pageSize || !view || !tab) {
      if (!pageNo) params.set('pageNo', 1);
      if (!pageSize) params.set('pageSize', 8);
      if (!view) params.set('view', ORDER_VIEW.ALL_ORDERS);
      if (!tab) params.set('tab', ORDER_TABS.SUBMITTED_BUY_AND_BILL);
      navigate(`${location.pathname}?${params.toString()}`, { replace: false });
    } else {
      setCurrentPage(+pageNo);
      changeOrderView(view);
    }
  }, [location.search]);

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const columns = getTableColumns(tab, t, alertContainerId);
  const handleOnViewChange = (view) => {
    const params = new URLSearchParams(location.search);
    params.set('view', view);
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  return (
    <>
      <ModuleHeader
        heading={<TableHeading heading={t('table.ariaLabel.orderList')} />}
        controls={
          <div>
            <ToggleButtonGroup value={orderView} onChange={handleOnViewChange} exclusive>
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
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        totalRocords={paginationConfig.totalElements}
        recordsPerPage={paginationConfig.pageSize}
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
    </>
  );
};

OrderDataTable.propTypes = {
  type: PropTypes.string,
  pagination: PropTypes.bool
};

export default OrderDataTable;
