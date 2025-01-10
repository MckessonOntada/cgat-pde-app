import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomDataTable } from './dataTableComponent';
import { useOrders } from '../../context/OrderContext';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './OrderTableColumns';
import { useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import './OrderDataTable.module.scss';

const OrderDataTable = ({ tab, alertContainerId }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { dataState: data, paginationConfig, isFetching, error, setCurrentPage, applySort, refreshData } = useOrders();
  const columns = createColumns(t, navigate, tab, alertContainerId);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleOnPageChange = (_event, pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  return (
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
      isMobileView={isMobileView}
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
  );
};

OrderDataTable.propTypes = {
  type: PropTypes.string,
  pagination: PropTypes.bool
};

export default OrderDataTable;
