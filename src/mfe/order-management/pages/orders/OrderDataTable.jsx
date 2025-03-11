import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomDataTable } from '../../../../components/dataTableComponent';
import { useOrders } from '../../context/OrderContext';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './OrderTableColumns';
import { useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import './OrderDataTable.module.scss';
import useResponsiveView from '@src/hooks/useResponsiveView';
import TableHeading from '@src/components/tableHeading/TableHeading';
import ModuleHeader from '@src/components/module-header';
import { getTableColumns } from './TableColumns';

const OrderDataTable = ({ tab, alertContainerId }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { dataState: data, paginationConfig, isFetching, error, setCurrentPage, applySort, refreshData } = useOrders();
  // const columns = createColumns(t, navigate, tab, alertContainerId);
  const showCardView = useResponsiveView();

  const handleOnPageChange = (_event, pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const columns = getTableColumns(tab, t, alertContainerId);

  return (
    <>
      <ModuleHeader heading={<TableHeading heading={t('table.ariaLabel.orderList')} />} controls={<div>[All Orders | My Orders]</div>} />
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
