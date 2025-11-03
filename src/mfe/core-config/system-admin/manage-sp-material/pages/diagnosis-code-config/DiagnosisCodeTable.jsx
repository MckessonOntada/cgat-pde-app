import { CustomDataTable } from '@src/components/dataTableComponent';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { useTranslate } from '@src/translations/useTranslation';
import { CheckboxGroup } from '@mckesson/mcp-component-library';
import React from 'react';

function DiagnosisCodeTable() {
  const showCardView = useResponsiveView();
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
        selector: (row) => row.contact,
        sortable: true,
        sortKey: 'email',
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
        selector: (row) => row.description,
        sortable: true,
        sortKey: 'description',
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
        selector: (row) => row.lastUpdatedOn,
        sortable: true,
        sortKey: 'lastUpdatedOn',
        wrap: true,
        minWidth: '200px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.lastUpdatedOn} maxWidth={190} />
          </div>
        )
      },
      {
        id: 'action',
        name: translateFn('Action'),
        wrap: true,
        minWidth: '200px',
        cell: (props) => <div>Action</div>
      }
    ];
  }, []);
  return (
    <div>
      <CustomDataTable
        type={'normal'}
        columns={columns}
        data={[{}]}
        onSortIconClick={() => {}}
        handleChangePage={() => {}}
        selectableRowsHeader={false}
        currentPage={1}
        totalPageCount={13}
        totalRocords={100}
        recordsPerPage={8}
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
