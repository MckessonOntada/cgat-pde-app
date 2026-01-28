import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { createColumns } from './helpers';
import CommonUtils from '@src/util/CommonUtils';
import { useFilters, usePagination, useTable } from '@src/context/TableContext';

function Materials({ selection = [], setSelection, omitColumns = [], columnActions, trade, onChange, readOnly, error }) {
  const showCardView = useResponsiveView();
  const { t: translateFn } = useTranslate();
  const [expandedRows, setExpandedRows] = React.useState([]);
  const { pagination, changePage } = usePagination();
  const { data, loading } = useTable();
  const { filters } = useFilters();
  const isFilterApplied = Object.values(filters).some((v) => v !== null && v !== undefined && v !== '');
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
    const expandedColumns = createColumns({
      t: translateFn,
      omitColumns,
      columnActions,
      selectedRecords: selection,
      setSelectedRecords: setSelection,
      data,
      trade,
      onChange,
      readOnly
    });
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

  const columns = createColumns({
    t: translateFn,
    selectedRecords: selection,
    setSelectedRecords: setSelection,
    data,
    trade,
    omitColumns,
    columnActions,
    onChange,
    readOnly,
    isRowExpanded,
    onExpandToggle
  });

  return (
    <div>
      <CustomDataTable
        id={'materials'}
        type={'normal'}
        columns={columns}
        data={data}
        onSortIconClick={() => {}}
        handleChangePage={(_event, newPageIndex) => changePage && changePage(newPageIndex)}
        currentPage={pagination.pageNo}
        totalPageCount={pagination.totalPages}
        totalRocords={pagination.totalElements}
        recordsPerPage={pagination.pageSize}
        paginationTotalRecorsMessage={translateFn('table.pagination.result')}
        paginationRecordsPerPageMessage={translateFn('table.pagination.perPage')}
        stickyHeader
        responsive
        pagination={true}
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
            isEr
            ror={error}
            image={EmptyDataImage}
            heading={isFilterApplied ? translateFn('errors.messages.noRecordsFound') : translateFn('emptyTable.title.noRecordsFoundUserMaterials')}
            description={!isFilterApplied && translateFn('emptyTable.description.noRecordsFoundUserMaterials')}
          />
        }
      />
    </div>
  );
}

export default Materials;
