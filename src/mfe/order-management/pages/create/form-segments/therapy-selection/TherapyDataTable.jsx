import React, { useState } from 'react';
import { useTherapy } from '../../../../context/TherapyContext';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './TherapyDataColumns';
import { useLocation, useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import CommonUtils from '@src/util/CommonUtils';

const TherapyDataTable = (props) => {
  const { trade, onChange } = props;
  const { t } = useTranslate();
  const { data, paginationConfig, setPageNumber, isFetching, error, applySort, fileteredData } = useTherapy();

  const showCardView = useResponsiveView();

  const [expandedRows, setExpandedRows] = React.useState([]);
  const isRowExpanded = (trade) => {
    return expandedRows.includes(trade.tradeName);
  };
  const onExpandToggle = (tradeName) => {
    setExpandedRows((prev) => (prev.includes(tradeName) ? prev.filter((id) => id !== tradeName) : [...prev, tradeName]));
  };

  React.useEffect(() => {
    if (data && trade) {
      if (!expandedRows.includes(trade.tradeName)) {
        onExpandToggle(trade.tradeName);
      }
    }
  }, [data, trade]);

  const ExpandedComponent = ({ data }) => {
    if (!CommonUtils.isNonEmptyArray(data.therapies)) return null;
    const expandedData = data.therapies || [];
    const expandedColumns = createColumns({ t, trade, onChange });
    return (
      <div className="expanded-rows">
        <CustomDataTable
          data={expandedData}
          columns={expandedColumns}
          noTableHead
          noHeader
          pagination={false}
          showHeader={false}
          hideColumnHeader
          type="expanded"
          striped
        />
      </div>
    );
  };

  const handleOnPageChange = (_event, pageIndex) => {
    setPageNumber(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) {
      applySort({
        sortBy: selectedColumn.sortKey,
        sortOrder: sortDirection
      });
    }
  };

  const columns = createColumns({ t, trade, onChange, isRowExpanded, onExpandToggle });

  return (
    <CustomDataTable
      id="order-management-therapy-listing"
      type="normal"
      columns={columns}
      data={data}
      handleChangePage={handleOnPageChange}
      onSortIconClick={handleOnSort}
      pagination
      currentPage={paginationConfig.pageNumber}
      totalPageCount={paginationConfig.totalPages}
      totalRocords={paginationConfig.totalElements}
      recordsPerPage={paginationConfig.pageSize}
      aria-label={t('table.ariaLabel.orderList')}
      paginationRecordsPerPageMessage={t('labels.perPage')}
      paginationTotalRecorsMessage={t('labels.results')}
      showCardView={showCardView}
      defaultExpandedCardView={false}
      expandableRows
      expandableRowExpanded={isRowExpanded}
      expandableRowsComponent={ExpandedComponent}
      expandableRowsHideExpander={true}
      nestedCardViewKey={'therapies'}
      noDataComponent={
        <EmptyDataTable
          isLoading={isFetching}
          error={error?.message}
          image={EmptyDataImage}
          heading={!fileteredData ? t('table.labels.therapySelectionNoDataAvailable') : t('errors.messages.noRecordsFound')}
          description={!fileteredData && t('table.labels.therapySelectionNoDataAvailableDescription')}
        />
      }
    />
  );
};

export default TherapyDataTable;
