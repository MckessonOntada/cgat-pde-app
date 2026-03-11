import React from 'react';
// import { useTherapy } from '../../../../context/TherapyContext';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './TherapyDataColumns';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import CommonUtils, { checkIsDataFiltered } from '@src/util/CommonUtils';
import { useFilters, usePagination, useSort, useTable } from '@src/context/TableContext';

const TherapyDataTable = (props) => {
  const { trade, onChange, readOnly } = props;
  const { t } = useTranslate();
  // const { paginationConfig, setPageNumber, isFetching, error, _applySort, filterConfig } = useTherapy();
  const { sort, applySort } = useSort();
  const { data, error, loading } = useTable();
  const { filters } = useFilters();
  const { pagination, changePage } = usePagination();
  const isDataFiltered = React.useMemo(() => {
    return checkIsDataFiltered(filters);
  }, [filters]);
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
    const expandedColumns = createColumns({ t, trade, onChange, readOnly });
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

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) {
      applySort(selectedColumn.sortKey, sortDirection);
    }
  };

  const columns = createColumns({ t, trade, onChange, readOnly, isRowExpanded, onExpandToggle });

  return (
    <CustomDataTable
      id="order-management-therapy-listing"
      type="normal"
      columns={columns}
      data={data}
      handleChangePage={(_event, pageIndex) => changePage(pageIndex)}
      onSortIconClick={handleOnSort}
      pagination
      currentPage={pagination.pageNo}
      totalPageCount={pagination.totalPages}
      totalRocords={pagination.totalElements}
      recordsPerPage={pagination.pageSize}
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
          isLoading={loading}
          error={error?.message}
          image={EmptyDataImage}
          heading={isDataFiltered ? t('errors.messages.noRecordsFound') : t('table.labels.therapySelectionNoDataAvailable')}
          description={!isDataFiltered && t('table.labels.therapySelectionNoDataAvailableDescription')}
        />
      }
    />
  );
};

export default TherapyDataTable;
