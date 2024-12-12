import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import { useTherapy } from '../../../../context/TherapyContext';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './TherapyDataColumns';
import { useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { therapyData } from './__mock__';

const TherapyDataTable = ({ selectedRowId, setSelectedRowId }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { data, paginationConfig, setPageNumber, applySort } = useTherapy();

  const columns = createColumns(t, navigate, selectedRowId, setSelectedRowId);

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
      id="order-management-therapy-listing"
      type={'normal'}
      columns={columns}
      data={data}
      handleChangePage={handleOnPageChange}
      onSortIconClick={handleOnSort}
      pagination={true}
      currentPage={1}
      totalPageCount={paginationConfig.pages}
      totalRocords={paginationConfig.total}
      recordsPerPage={1}
      aria-label={t('table.ariaLabel.orderList')}
      paginationRecordsPerPageMessage={'per page'}
      paginationTotalRecorsMessage={'result'}
      noDataComponent={<EmptyDataTable isLoading={false} image={EmptyDataImage} heading={t('table.add.label')} description={t('table.empty_table_description')} />}
    />
  );
};

TherapyDataTable.propTypes = {
  type: PropTypes.string,
  pagination: PropTypes.bool
};

export default TherapyDataTable;
