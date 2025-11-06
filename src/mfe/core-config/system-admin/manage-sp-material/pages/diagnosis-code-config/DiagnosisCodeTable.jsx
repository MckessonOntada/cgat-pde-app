import { CheckboxGroup, IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { usePagination, useTable } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import React from 'react';

function DiagnosisCodeTable({ omitColumns = [], selectedCodes, setSelectedCodes }) {
  const showCardView = useResponsiveView();
  const { pagination, changePage } = usePagination();
  const { data } = useTable();
  const { t: translateFn } = useTranslate();
  console.log(selectedCodes);
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
        name: translateFn('Description'),
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
        name: translateFn('Last Updated On'),
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
        name: translateFn('Action'),
        wrap: true,
        maxWidth: '120px',
        cell: (props) => (
          <div className="styled-icon-button error-button">
            <IconButton
              size="lg"
              label={'Delete'}
              textButton={true}
              iconButton={false}
              color={'error'}
              variant={'tertiary'}
              Icon={DeleteIcon}
              onClick={() => {}}
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
