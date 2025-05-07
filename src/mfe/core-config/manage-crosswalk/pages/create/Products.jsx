import React from 'react';
import {
  usePagination,
  useTable
} from '@src/mfe/core-config/manage-providers/context/TableContext';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';

const getColumns = ({
  t,
  pagination,
  selectedMaterials,
  setSelectedMaterials,
  data
}) => {
  return [
    {
      id: 'checkbox',
      name: renderTableCheckBox(
        { id: 'ALL_ITEMS_' + pagination.pageNo },
        data,
        'materialNumber',
        pagination,
        selectedMaterials,
        setSelectedMaterials
      ),
      cell: (row, index) =>
        renderTableCheckBox(
          row,
          data,
          'materialNumber',
          pagination,
          selectedMaterials,
          setSelectedMaterials
        ),
      selector: (row) => row['Material Number'],
      width: '50px',
      showInMobileHeader: true
    },
    {
      id: 'genericName',
      name: t('manageSPMaterial.table.productname'),
      selector: (row) => {},
      minWidth: '240px',
      sortable: true,
      sortKey: 'material_description',
      wrap: true,
      cell: (props) => (
        <EclipsesTextcss str={props?.materialDescription} maxWidth={350} />
      )
    },
    {
      id: 'ndcNumber',
      name: t('manageSPMaterial.table.ndc'),
      selector: (row) => {},
      minWidth: '140px',
      sortable: false,
      sortKey: 'ndc_number',
      wrap: true,
      cell: (props) => <div>{props?.ndcNumber || '-'}</div>
    }
  ];
};

const Products = () => {
  const { t } = useTranslate();
  const { data } = useTable();
  const { pagination, changePage } = usePagination();

  return (
    <div>
      <CustomDataTable
        id="manage-material-table"
        type="normal"
        columns={getColumns({
          t,
          pagination,
          selectedMaterials: [],
          setSelectedMaterials: () => {},
          data
        })}
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

export default Products;
