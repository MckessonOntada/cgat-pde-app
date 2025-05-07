import React from 'react';
import {
  usePagination,
  useTable
} from '@src/mfe/core-config/manage-providers/context/TableContext';
import { RadioGroup } from '@mckesson/mcp-component-library';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { useTranslate } from '@src/translations/useTranslation';

const getColumns = ({ t, material, onChange = () => {} }) => {
  return [
    {
      id: 'id',
      selector: () => {},
      width: '40px',
      sortable: false,
      showInMobileHeader: true,
      isSelectable: true,
      cell: (props) => (
        <div className="MCP-table-cell radio-button-wrapper">
          <RadioGroup
            direction="column"
            id={`radio-button-material-${props.id}`}
            items={[
              {
                isDisabled: false,
                label: ' ',
                value: props.id
              }
            ]}
            onChangeValue={() => {
              onChange(props);
            }}
            onOtherTextChange={() => {}}
            onSubRadioFieldChange={() => {}}
            radioBtnWidth="auto"
            value={material?.id == props.id ? props.id : ''}
          />
        </div>
      )
    },
    {
      name: t('manageMaterial.table.materialDescription'),
      id: 'materialDescription',
      selector: (row) => row.materialDescription,
      wrap: true,
      minWidth: '240px',
      maxWidth: '240px',
      cell: (props) => (
        <div className="cellEllipse">{props?.materialDescription || '-'}</div>
      )
    },
    {
      name: t('manageMaterial.table.nationalDrugCode'),
      id: 'ndcNumber',
      selector: (row) => row.ndcNumber,
      wrap: true,
      minWidth: '140px',
      maxWidth: '140px',
      cell: (props) => (
        <div className="cellEllipse">{props?.ndcNumber || '-'}</div>
      )
    }
  ];
};

const Materials = () => {
  const { t } = useTranslate();
  const { data } = useTable();
  const { pagination, changePage } = usePagination();

  return (
    <div>
      <CustomDataTable
        id="manage-material-table"
        type="normal"
        columns={getColumns({ t, onChange: () => {} })}
        data={data}
        currentPage={pagination.pageNo}
        totalPageCount={pagination.totalPages}
        pagination={true}
        totalRocords={pagination.totalElements}
        handleChangePage={(_event, pageNumber) => changePage(pageNumber)}
        recordsPerPage={pagination.pageSize}
        paginationTotalRecorsMessage={t(
          'manageMaterial.table.pagination.totalRecords'
        )}
        paginationRecordsPerPageMessage={t(
          'manageMaterial.table.pagination.perPage'
        )}
        responsive={true}
        showCardView={false}
        defaultExpandedCardView={true}
      />
    </div>
  );
};

export default Materials;
