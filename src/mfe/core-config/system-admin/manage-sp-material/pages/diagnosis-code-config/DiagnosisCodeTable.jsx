import { CheckboxGroup, IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { CustomDataTable } from '@src/components/dataTableComponent';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { usePagination, useTable } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import React from 'react';

function DiagnosisCodeTable({ omitColumns = [] }) {
  const showCardView = useResponsiveView();
  const { pagination, changePage } = usePagination();
  const { data } = useTable();
  const { t: translateFn } = useTranslate();
  const columns = React.useMemo(() => {
    return [
      {
        id: 'checkbox',
        name: '',
        showInMobileHeader: true,
        cell: (row) => (
          <CheckboxGroup
            id={'default'}
            caption=""
            items={[
              {
                onChange: (event) => {},
                value: row.id
                // isChecked: selectedRows === row.id
                // isDisabled: (!isSystemAdmin && !row?.isActive) || AuthUtils.isPhysician(row?.role?.name, row?.role?.id)
              }
            ]}
          />
        ),
        wrap: true,
        width: '40px'
      },
      {
        id: 'icd-10-codes',
        name: translateFn('ICD-10 Codes'),
        wrap: true,
        minWidth: '200px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.contact?.email} maxWidth={190} />
          </div>
        )
      },
      {
        id: 'description',
        name: translateFn('Description'),
        wrap: true,
        minWidth: '200px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.description} maxWidth={190} />
          </div>
        )
      },
      {
        id: 'last-updated-on',
        name: translateFn('Last Updated On'),
        wrap: true,
        minWidth: '200px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.lastUpdatedOn} maxWidth={190} />
          </div>
        ),
        omit: omitColumns.includes('last-updated-on')
      },
      {
        id: 'action',
        name: translateFn('Action'),
        wrap: true,
        minWidth: '200px',
        cell: (props) => (
          <div className="styled-icon-button error-button">
            <IconButton size="lg" textButton={true} color={'error'} variant={'tertiary'} Icon={DeleteIcon} onClick={() => {}} />
          </div>
        ),
        omit: omitColumns.includes('action')
      }
    ];
  }, [omitColumns]);
  return (
    <div>
      <CustomDataTable
        type={'normal'}
        columns={columns}
        data={data}
        onSortIconClick={() => {}}
        handleChangePage={changePage}
        selectableRowsHeader={false}
        currentPage={pagination.pageNo}
        totalPageCount={pagination.totalPages}
        totalRocords={pagination.totalElements}
        recordsPerPage={pagination.pageSize}
        paginationTotalRecorsMessage={translateFn('userManagement.results')}
        paginationRecordsPerPageMessage={translateFn('userManagement.per_page')}
        stickyHeader
        responsive
        pagination={true}
        showCardView={showCardView}
        defaultExpandedCardView={true}
        noDataComponent={'No Data Found'}
      />
    </div>
  );
}

export default DiagnosisCodeTable;
