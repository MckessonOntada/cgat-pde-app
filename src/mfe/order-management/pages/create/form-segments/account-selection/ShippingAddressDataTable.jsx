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

const ShippingAddressDataTable = ({ type = 'normal', pagination = true }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { dataState: data, pageConfig, setPageConfig, setCurrentPage, setShippingAddressData } = useShippingAddress();
  const [sortConfig, setSortConfig] = React.useState({
    columnName: null,
    direction: null
  });

  const columns = createColumns(t, navigate);

  React.useEffect(() => {
    setShippingAddressData(shippingAddressData);
  }, []);
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setPageConfig({
        total: data.length,
        pageSize: 8,
        pages: Math.ceil(data.length / 8),
        currentPage: 1
      });
    }
  }, [data]);

  const handleOnPageChange = (_event, pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection, sortedRows) => {
    const targetColumnName = selectedColumn.id;
    console.log(selectedColumn, sortDirection, sortedRows);
    const { columnName, direction } = sortConfig;

    if (columnName && columnName === targetColumnName) {
      setSortConfig((prevConfig) => ({
        ...prevConfig,
        direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setSortConfig({
        columnName: targetColumnName,
        direction: 'asc'
      });
    }

    const sortedData = data.sort((a, b) => {
      if (direction === 'asc') {
        return a[targetColumnName] > b[targetColumnName] ? 1 : -1;
      } else {
        return a[targetColumnName] < b[targetColumnName] ? 1 : -1;
      }
    });
    setShippingAddressData(sortedData);
  };

  const { currentPage, pageSize } = pageConfig;
  const batchEnd = currentPage * pageSize;
  const batchStart = batchEnd - pageSize;
  const batch = data.slice(batchStart, batchEnd);

  return (
    <CustomDataTable
      id="order-management-shippingAddress-listing"
      type={'normal'}
      columns={columns}
      data={batch}
      handleChangePage={handleOnPageChange}
      onSortIconClick={handleOnSort}
      pagination={pagination}
      currentPage={currentPage}
      totalPageCount={pageConfig.pages}
      totalRocords={pageConfig.total}
      recordsPerPage={pageSize}
      aria-label={t('table.ariaLabel.orderList')}
      paginationRecordsPerPageMessage={'per page'}
      paginationTotalRecorsMessage={'result'}
      noDataComponent={<EmptyDataTable isLoading={false} image={EmptyDataImage} heading={t('messages.selectAnAccountForShippingAddress')} description={''} />}
    />
  );
};

ShippingAddressDataTable.propTypes = {
  type: PropTypes.string,
  pagination: PropTypes.bool
};

export default ShippingAddressDataTable;
