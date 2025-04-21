import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CustomDataTable,
  Loader,
  Badge
} from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { useSPMaterial } from '../context/SPMaterialContext';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import SPMaterialDetails from './SPMaterialDetails';

function SPMaterialDataTable() {
  const { t } = useTranslate();
  const {
    paginationConfig,
    data,
    setPageNumber,
    isLoading,
    refreshData,
    applySort
  } = useSPMaterial();
  const [openSPMaterialDetails, setOpenSPMaterialDetails] = useState(false);
  const [viewSPMaterial, setViewSPMaterial] = useState(null);

  const columns = [
    {
      name: t('manageSPMaterial.table.spproductId'),
      id: 'material_number',
      selector: (row) => {},
      wrap: true,
      minWidth: '220px',
      sortable: true,
      sortKey: 'material_number',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{
              color: '#007bff',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            onClick={() => {
              setViewSPMaterial(props);
              setOpenSPMaterialDetails(true);
            }}>
            <EclipsesTextcss str={props?.materialNumber} maxWidth={280} />
          </Link>
        </div>
      )
    },
    {
      id: 'genericName',
      name: t('manageSPMaterial.table.productname'),
      selector: (row) => {},
      minWidth: '350px',
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
      minWidth: '250px',
      sortable: false,
      sortKey: 'ndc_number',
      wrap: true,
      cell: (props) => <div>{props?.ndcNumber || '-'}</div>
    },
    {
      id: 'siteName',
      name: t('manageSPMaterial.table.sitename'),
      selector: (row) => {},
      minWidth: '250px',
      sortable: true,
      sortKey: 'site_name',
      wrap: true,
      cell: (props) => <div>{props?.siteName || '-'}</div>
    },
    {
      id: 'status',
      name: t('manageSPMaterial.table.status'),
      selector: (row) => {},
      sortKey: 'status',
      minWidth: '100px',
      center: true,
      cell: (props) =>
        props.itemStatus === 'A' ? (
          <Badge
            customStyle={{ minWidth: '120px' }}
            text="Active"
            type="success"
          />
        ) : (
          <Badge
            customStyle={{ minWidth: '120px' }}
            text="Inactive"
            type="info-default"
          />
        )
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };
  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey)
      applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  return (
    <div>
      <TableHeading
        heading={t('manageSPMaterial.heading.materialListing')}
        style={{ marginBottom: '16px' }}
      />
      <CustomDataTable
        id="sp-material-table"
        type="normal"
        columns={columns}
        data={data}
        onSortIconClick={handleOnSortIconClick}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        pagination={true}
        handleChangePage={handleChangePage}
        totalRocords={paginationConfig.totalElements}
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('orgManagement.results')}
        paginationRecordsPerPageMessage={t('orgManagement.per_page')}
        noDataComponent={
          <EmptyDataTable
            image={EmptyDataImage}
            heading={t('manageSPMaterial.messageemptyTableTitle')}
            description={t('manageSPMaterial.messages.emptyTableSubtitle')}
          />
        }
        progressPending={isLoading}
        progressComponent={
          <div
            style={{
              alignItems: 'center',
              border: '1px solid #ccc',
              display: 'flex',
              height: '350px',
              justifyContent: 'center'
            }}>
            <Loader variant="circular" />
          </div>
        }
      />

      <SPMaterialDetails
        openSPMaterialDetails={openSPMaterialDetails}
        setOpenSPMaterialDetails={setOpenSPMaterialDetails}
        viewSPMaterial={viewSPMaterial}
      />
    </div>
  );
}
export default SPMaterialDataTable;
