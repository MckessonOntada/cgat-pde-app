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

const TherapyDataTable = ({ type = 'normal', pagination = true, selectedRowId, setSelectedRowId }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { data, pageConfig } = useTherapy();

  const columns = createColumns(t, navigate, selectedRowId, setSelectedRowId);

  const handleOnPageChange = (_event, pageIndex) => {
    // setCurrentPage(pageIndex);
  };

  const handleOnSort = (_event, pageIndex) => {
    // setCurrentPage(pageIndex);
  };

  return (
    <CustomDataTable
      id="order-management-therapy-listing"
      type={'normal'}
      columns={columns}
      data={data}
      handleChangePage={handleOnPageChange}
      onSortIconClick={handleOnSort}
      pagination={pagination}
      currentPage={1}
      totalPageCount={pageConfig.pages}
      totalRocords={pageConfig.total}
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
