import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomDataTable, Loader, Button } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useCatalogContext } from '../context/CatalogContext';
import ConfigureCatalog from './ConfigureCatalog';
import CatalogDetails from './CatalogDetails';
import TableHeading from '@src/components/tableHeading/TableHeading';
import AuthUtils from '@src/util/AuthUtils';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';

function CatalogDataTable(props) {
  const { t } = useTranslate();

  const { paginationConfig, catalogList: data, fileteredData, setPageNumber, isLoading } = useCatalogContext();
  const [selectedCatalogs, setSelectedCatalogs] = useState([]);
  const [openConfigurationDraw, setOpenConfigurationDraw] = useState(false);
  const [openCatalogDetails, setOpenCatalogDetails] = useState(false);
  const [viewCatalog, setViewCatalog] = useState(null);
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const { showAlert } = props;
  const columns = [
    {
      id: 'checkbox',
      name: renderTableCheckBox({ id: 'ALL_ITEMS_' + paginationConfig.pageNumber }, data, 'id', paginationConfig, selectedCatalogs, setSelectedCatalogs),
      sortable: false,
      cell: (row, index) => renderTableCheckBox(row, data, 'id', paginationConfig, selectedCatalogs, setSelectedCatalogs),
      // selector: (row) => row.MRN,
      width: '50px',
      omit: isCustomerCenter
    },
    {
      name: t('ManageCatalog.Table.SAPMaterialID'),
      id: 'sapMaterial',
      selector: (row) => {},
      wrap: true,
      minWidth: '220px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{
              color: '#007bff',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            onClick={() => {
              setViewCatalog(props);
              setOpenCatalogDetails(true);
            }}>{`${props?.sapMaterial || ''}`}</Link>
        </div>
      )
    },
    {
      id: 'materialDescriptionInLanguageEn',
      name: t('ManageCatalog.Table.MaterialDescription'),
      selector: (row) => {},
      minWidth: '200px',
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props?.materialDescriptionInLanguageEn || '-'}</div>
    },
    {
      id: 'ndc',
      name: t('ManageCatalog.Table.NDC'),
      selector: (row) => {},
      minWidth: '100px',
      wrap: true,
      cell: (props) => <div>{props?.ndc || '-'}</div>
    },
    {
      id: 'distChannel',
      name: t('ManageCatalog.Table.DistChannel'),
      selector: (row) => {},
      minWidth: '100px',
      wrap: true,
      cell: (props) => <div>{props?.distChannel || '-'}</div>
    },
    {
      id: 'variant',
      name: t('ManageCatalog.Table.Variant'),
      selector: (row) => {},
      minWidth: '100px',
      wrap: true,
      cell: (props) => <div>{props?.variant || '-'}</div>
    },
    {
      id: 'soldToCustomer',
      name: t('ManageCatalog.Table.Soldto'),
      selector: (row) => {},
      minWidth: '100px',
      wrap: true,
      cell: (props) => <div>{props?.soldToCustomer || '-'}</div>
    },
    {
      id: '',
      name: t('ManageCatalog.Table.Shipto'),
      selector: (row) => {},
      minWidth: '100px',
      wrap: true,
      cell: (props) => <div>{props?.shipToCustomer || '-'}</div>
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  return (
    <div>
      <TableHeading
        heading={t('table.ariaLabel.catalogList')}
        secondaryView={selectedCatalogs?.length}
        secondaryViewHeading={`${selectedCatalogs?.length} ${t('orgManagement.selected_items')}`}
        secondaryViewControls={
          <Button variant="secondary" onClick={() => setOpenConfigurationDraw(true)}>
            {t('ManageCatalog.Button.Configure')}
          </Button>
        }
        style={{ marginBottom: '16px' }}
      />

      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns}
        data={data}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        pagination={true}
        handleChangePage={handleChangePage}
        totalRocords={paginationConfig.totalElements} // Corrected typo here
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('orgManagement.results')}
        paginationRecordsPerPageMessage={t('orgManagement.per_page')}
        noDataComponent={
          <EmptyDataTable
            image={EmptyDataImage}
            heading={!fileteredData ? t('ManageCatalog.Table.nodata') : t('errors.messages.noRecordsFound')}
            description={!fileteredData && t('ManageCatalog.Table.nodataMsg')}
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

      <ConfigureCatalog
        openConfigurationDraw={openConfigurationDraw}
        setOpenConfigurationDraw={setOpenConfigurationDraw}
        selectedCatalogs={selectedCatalogs}
        setSelectedCatalogs={setSelectedCatalogs}
        showAlert={showAlert}
      />

      <CatalogDetails
        openCatalogDetails={openCatalogDetails}
        setOpenCatalogDetails={setOpenCatalogDetails}
        viewCatalog={viewCatalog}
        setViewCatalog={setViewCatalog}
        showAlert={showAlert}
      />
    </div>
  );
}
export default CatalogDataTable;
