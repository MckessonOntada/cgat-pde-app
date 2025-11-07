import { IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { usePagination, useTable } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import React from 'react';

function DiagnosisCodeTable({ omitColumns = [], selectedCodes, setSelectedCodes, onDelete }) {
  const showCardView = useResponsiveView();
  const { pagination, changePage } = usePagination();
  const { data, loading, error, isFilterApplied } = useTable();
  const { t: translateFn } = useTranslate();
  const columns = React.useMemo(() => {
    return [
      {
        id: 'checkbox',
        showInMobileHeader: true,
        name:
          data?.length > 0
            ? renderTableCheckBox(
                { id: 'ALL_ITEMS_' + pagination.pageNo },
                data,
                'id',
                { ...pagination, pageNumber: pagination.pageNo },
                selectedCodes,
                setSelectedCodes,
                true,
                true
              )
            : null,
        sortable: false,
        cell: (row, index) =>
          renderTableCheckBox(row, data, 'id', { ...pagination, pageNumber: pagination.pageNo }, selectedCodes, setSelectedCodes, true, true),
        selector: (row) => row.id,
        width: '50px'
      },
      {
        id: 'icd-10-codes',
        name: translateFn('ICD-10 Codes'),
        wrap: true,
        maxWidth: '200px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.code} maxWidth={190} />
          </div>
        )
      },
      {
        id: 'description',
        name: translateFn('table.column.caption.description'),
        wrap: true,
        minWidth: '420px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.longDescription} maxWidth={410} />
          </div>
        )
      },
      {
        id: 'last-updated-on',
        name: translateFn('table.column.caption.lastUpdatedOn'),
        wrap: true,
        maxWidth: '200px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={CommonUtils.convertDateStringFormat(props.updatedAt || props.createdAt)} maxWidth={190} />
          </div>
        ),
        omit: omitColumns.includes('last-updated-on')
      },
      {
        id: 'action',
        name: translateFn('table.column.caption.action'),
        wrap: true,
        maxWidth: '120px',
        cell: (props) => (
          <div className="styled-icon-button error-button">
            <IconButton
              size="lg"
              label={translateFn('button.caption.remove')}
              textButton={true}
              iconButton={false}
              color={'error'}
              variant={'tertiary'}
              Icon={DeleteIcon}
              onClick={() => onDelete([props.id])}
            />
          </div>
        ),
        omit: omitColumns.includes('action')
      }
    ];
  }, [omitColumns, selectedCodes, pagination.pageNo]);

  return (
    <div>
      <CustomDataTable
        id={'assigned-diagnosis-codes'}
        type={'normal'}
        columns={columns}
        data={data}
        onSortIconClick={() => {}}
        handleChangePage={(_event, newPageIndex) => changePage(newPageIndex)}
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
        defaultExpandedCardView={true}
        noDataComponent={
          <EmptyDataTable
            isLoading={loading}
            isError={error}
            image={EmptyDataImage}
            heading={isFilterApplied ? translateFn('table.messages.noRecordsFoundWithFilters') : translateFn('table.message.noRecordsFoundDiagnosisCodes')}
            description={!isFilterApplied && translateFn('table.description.noRecordsFoundDiagnosisCodes')}
          />
        }
      />
    </div>
  );
}

export default DiagnosisCodeTable;
