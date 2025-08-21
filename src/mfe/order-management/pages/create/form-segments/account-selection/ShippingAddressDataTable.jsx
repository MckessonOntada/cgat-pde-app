import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useShippingAddress } from '../../../../context/ShippingAddressContext';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './ShippingAddressDataColumns';
import { useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { checkIsDataFiltered } from '@src/util/CommonUtils';

const ShippingAddressDataTable = ({ pagination = true, selectedShippingAddress, setSelectedShippingAddress, readOnly }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { dataState: data, pageConfig, isFetching, isError, error, setPageNumber, selectedAccount, applySort, filterState } = useShippingAddress();
  const columns = createColumns(t, navigate, selectedShippingAddress, setSelectedShippingAddress, readOnly);
  const showCardView = useResponsiveView();
  const isDataFiltered = React.useMemo(() => {
    return checkIsDataFiltered(filterState);
  }, [filterState]);
  const handleOnPageChange = (_event, pageIndex) => {
    setPageNumber(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) {
      applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
    }
  };

  return (
    <CustomDataTable
      id="order-management-shippingAddress-listing"
      type={'normal'}
      columns={columns}
      data={data}
      handleChangePage={handleOnPageChange}
      onSortIconClick={handleOnSort}
      pagination={true}
      currentPage={pageConfig.pageNumber}
      totalPageCount={pageConfig.totalPages}
      totalRocords={pageConfig.totalElements}
      recordsPerPage={pageConfig.pageSize}
      aria-label={t('table.ariaLabel.orderList')}
      paginationRecordsPerPageMessage={'per page'}
      paginationTotalRecorsMessage={'result'}
      showCardView={showCardView}
      noDataComponent={
        <EmptyDataTable
          isLoading={isFetching}
          error={isError && error.message}
          image={EmptyDataImage}
          heading={
            isDataFiltered
              ? t('errors.messages.noRecordsFound')
              : selectedAccount
              ? t('messages.noShippingAddressFound')
              : t('messages.selectAnAccountForShippingAddress')
          }
          description={''}
        />
      }
    />
  );
};

ShippingAddressDataTable.propTypes = {
  type: PropTypes.string,
  pagination: PropTypes.bool
};

export default ShippingAddressDataTable;
