import React from 'react';
import PropTypes from 'prop-types';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import { useTherapy } from '../../../../context/TherapyContext';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './TherapyDataColumns';
import { useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';

const TherapyDataTable = ({ therapy, onChange }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { data, paginationConfig, setPageNumber, isFetching, error, applySort } = useTherapy();

  const columns = createColumns(t, navigate, therapy, onChange);

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
      currentPage={paginationConfig.pageNumber}
      totalPageCount={paginationConfig.totalPages}
      totalRocords={paginationConfig.totalElements}
      recordsPerPage={paginationConfig.pageSize}
      aria-label={t('table.ariaLabel.orderList')}
      paginationRecordsPerPageMessage={t('labels.perPage')}
      paginationTotalRecorsMessage={t('labels.results')}
      noDataComponent={
        <EmptyDataTable
          isLoading={isFetching}
          error={error && error.message}
          image={EmptyDataImage}
          heading={t('table.labels.therapySelectionNoDataAvailable')}
          description={t('table.labels.therapySelectionNoDataAvailableDescription')}
        />
      }
    />
  );
};

TherapyDataTable.propTypes = {
  type: PropTypes.string,
  pagination: PropTypes.bool
};

export default TherapyDataTable;
