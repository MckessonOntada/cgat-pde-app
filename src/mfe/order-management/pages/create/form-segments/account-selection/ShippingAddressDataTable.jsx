import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import { useShippingAddress } from '../../../../context/ShippingAddressContext';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './ShippingAddressDataColumns';
import { useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { shippingAddressData } from './__mock__';

const ShippingAddressDataTable = ({ pagination = true, selectedShippingAddress, setSelectedShippingAddress }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { dataState: data, pageConfig, setPageNumber } = useShippingAddress();
  const columns = createColumns(t, navigate, selectedShippingAddress, setSelectedShippingAddress);
  const { currentPage, pageSize } = pageConfig;

  const handleOnPageChange = (_event, pageIndex) => {
    setPageNumber(pageIndex);
  };

  return (
    <CustomDataTable
      id="order-management-shippingAddress-listing"
      type={'normal'}
      columns={columns}
      data={data}
      handleChangePage={handleOnPageChange}
      // onSortIconClick={handleOnSort}
      pagination={pagination}
      currentPage={currentPage}
      totalPageCount={pageConfig.pages}
      totalRocords={pageConfig.total}
      recordsPerPage={pageSize}
      aria-label={t('table.ariaLabel.orderList')}
      paginationRecordsPerPageMessage={'per page'}
      paginationTotalRecorsMessage={'result'}
      noDataComponent={
        <EmptyDataTable
          isLoading={false}
          image={EmptyDataImage}
          heading={t('messages.selectAnAccountForShippingAddress')}
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
