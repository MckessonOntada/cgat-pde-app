import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomDataTable, Loader, Badge } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { useSPMaterial } from '../context/SPMaterialContext';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import SPMaterialDetails from './SPMaterialDetails';

function SPMaterialDataTable(onActionSuccess) {
  const { t } = useTranslate();
  const { paginationConfig, data, setPageNumber, isLoading, refreshData } = useSPMaterial();
  const [selectedSPMaterials, setSelectedSPMaterials] = useState([]);
  const [openSPMaterialDetails, setOpenSPMaterialDetails] = useState(false);
  const [viewSPMaterial, setViewSPMaterial] = useState(null);

  const columns = [
    {
      name: t('manageSPMaterial.table.spproductId'),
      id: 'spProductID',
      selector: (row) => {},
      wrap: true,
      minWidth: '220px',
      sortable: true,
      sortKey: 'spProductID',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}
            onClick={() => {
              setViewSPMaterial(props);
              setOpenSPMaterialDetails(true);
            }}>
            <EclipsesTextcss str={props?.spProductID} maxWidth={280} />
          </Link>
        </div>
      )
    },
    {
      id: 'productName',
      name: t('manageSPMaterial.table.productname'),
      selector: (row) => {},
      minWidth: '300px',
      sortable: true,
      sortKey: 'productName',
      wrap: true,
      cell: (props) => <EclipsesTextcss str={props?.productName} maxWidth={350} />
    },
    {
      id: 'ndc',
      name: t('manageSPMaterial.table.ndc'),
      selector: (row) => {},
      minWidth: '200px',
      sortable: false,
      sortKey: 'ndc',
      wrap: true,
      cell: (props) => <div>{props?.ndc || '-'}</div>
    },
    {
      id: 'siteName',
      name: t('manageSPMaterial.table.sitename'),
      selector: (row) => {},
      minWidth: '200px',
      sortable: true,
      sortKey: 'siteName',
      wrap: true,
      cell: (props) => <div>{props?.siteName || '-'}</div>
    },
    {
      id: 'status',
      name: t('manageSPMaterial.table.status'),
      selector: (row) => {},
      sortable: true,
      sortKey: 'status',
      wrap: true,
      center: true,
      cell: (props) =>
        props.status == 'ACTIVE' ? (
          <Badge customStyle={{ minWidth: '110px' }} text="Active" type="success" />
        ) : (
          <Badge customStyle={{ minWidth: '110px' }} text="Inactive" type="info-default" />
        )
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  return (
    <div>
      <TableHeading heading={t('manageSPMaterial.heading.materialListing')} style={{ marginBottom: '16px' }} />
      <CustomDataTable
        id="sp-material-table"
        type="normal"
        columns={columns}
        data={data}
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
        setViewSPMaterial={setViewSPMaterial}
      />
    </div>
  );
}
export default SPMaterialDataTable;
