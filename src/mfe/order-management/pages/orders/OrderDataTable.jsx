import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CustomDataTable } from '../../../../components/dataTableComponent';
import { useOrders } from '../../context/OrderContext';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './OrderTableColumns';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import './OrderDataTable.module.scss';
import useResponsiveView from '@src/hooks/useResponsiveView';
import TableHeading from '@src/components/tableHeading/TableHeading';
import ModuleHeader from '@src/components/module-header';
import { getTableColumns } from './TableColumns';
import ToggleButtonGroup from './ToggleButtonGroup';
import ToggleButton from './ToggleButton';
import { TOGGLE_FILTERS } from './config';

const OrderDataTable = ({ tab, alertContainerId }) => {
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
    changeOrderView
  } = useOrders();
  const [charSize, setCharSize] = useState(0);
  const calculateMinWidth = useMemo(() => {
    if (typeof charSize === 'number' && charSize > 0) {
      return `${70 + charSize * 10}px`;
    }
    return '80px';
  }, [charSize]);

  // const columns = createColumns(t, navigate, tab, alertContainerId, calculateMinWidth, setCharSize);
  const showCardView = useResponsiveView();

  const handleOnPageChange = (_event, pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey)
      applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const columns = getTableColumns(tab, t, alertContainerId);
  const handleOnViewChange = (val) => {
    changeOrderView(val);
  };
  return (
    <>
      <ModuleHeader
        heading={<TableHeading heading={t('table.ariaLabel.orderList')} />}
        controls={
          <div>
            <ToggleButtonGroup
              value={orderView}
              onChange={handleOnViewChange}
              exclusive>
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
            heading={t('captions.emptyTableTitle')}
            description={t('captions.emptyTableSubtitle')}
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
