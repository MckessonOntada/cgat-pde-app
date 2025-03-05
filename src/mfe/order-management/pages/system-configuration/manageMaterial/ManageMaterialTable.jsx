import React from 'react';
import { Loader, Button, Alert } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import { useTranslate } from '@src/translations/useTranslation';
import { useManageMaterial } from '@src/mfe/order-management/context/ManageMaterialContext';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { Link } from 'react-router-dom';
import FloatingDrawer from '@src/components/floating-drawer';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import { ConfigConstants, MaterialDetailsConstants } from './assets/constants/MaterialConstants';
import ConfigureMaterials from './ConfigureMaterials';
import CommonUtils from '@src/util/CommonUtils';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import TableHeading from '@src/components/tableHeading/TableHeading';
import AuthUtils from '@src/util/AuthUtils';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';

function ManageMaterialTable({ ...props }) {
  const { t } = useTranslate();
  const { data, paginationConfig, setPageNumber, isFetching, isError, selectedMaterials, setSelectedMaterials } = useManageMaterial();
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openConfiguration, setOpenConfiguration] = React.useState(false);
  const [materialNumber, setMaterialNumber] = React.useState(null);
  const [configureSuccess, setConfigureSuccess] = React.useState(false);
  const [configureError, setConfigureError] = React.useState(false);
  const showCardView = useResponsiveView();
  const isCustomerCenter = AuthUtils.isCustomerCenter();

  const columns = [
    {
      id: 'checkbox',
      name: renderTableCheckBox(
        { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
        data,
        'materialNumber',
        paginationConfig,
        selectedMaterials,
        setSelectedMaterials
      ),
      // sortable: false,
      cell: (row, index) => renderTableCheckBox(row, data, 'materialNumber', paginationConfig, selectedMaterials, setSelectedMaterials),
      selector: (row) => row['Material Number'],
      width: '50px',
      showInMobileHeader: true,
      omit: isCustomerCenter
    },
    {
      name: t('manageMaterial.table.materialNumber'),
      id: 'materialNumber',
      selector: (row) => row.materialNumber,
      wrap: true,
      minWidth: '220px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}
            onClick={() => {
              setOpenDetails(!openDetails);
              setMaterialNumber(props?.materialNumber);
            }}>
            {props?.materialNumber || '-'}
          </Link>
        </div>
      )
    },
    {
      name: t('manageMaterial.table.materialDescription'),
      id: 'materialDescription',
      selector: (row) => row.materialDescription,
      wrap: true,
      minWidth: '220px',
      cell: (props) => <div className="cellEllipse">{props?.materialDescription || '-'}</div>
    },
    {
      name: t('manageMaterial.table.nationalDrugCode'),
      id: 'ndcNumber',
      selector: (row) => row.ndcNumber,
      wrap: true,
      minWidth: '214px',
      cell: (props) => <div className="cellEllipse">{props?.ndcNumber || '-'}</div>
    },
    {
      name: t('manageMaterial.table.strength'),
      id: 'strength',
      selector: (row) => row.strength,
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props?.strength || '-'}</div>
    },
    {
      name: t('manageMaterial.table.dosage'),
      id: 'dosage',
      selector: (row) => row.dosage,
      wrap: true,
      maxWidth: '140px',
      cell: (props) => <div className="cellEllipse">{props?.dosage || '-'}</div>
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  return (
    <React.Fragment>
      {configureSuccess && (
        <Alert
          description={t('manageMaterial.drawer.controls.apply.success')}
          onClose={() => setConfigureSuccess(false)}
          type="success"
          duration={3000}
        />
      )}
      {configureError && (
        <Alert
          description={t('manageMaterial.drawer.controls.apply.error')}
          onClose={() => setConfigureError(false)}
          type="error"
          duration={3000}
        />
      )}
      <TableHeading
        heading={'Material Listing'}
        secondaryView={selectedMaterials?.length}
        secondaryViewHeading={`${selectedMaterials?.length} ${t('manageMaterial.table.header.text')}`}
        secondaryViewControls={
          <Button
            variant="secondary"
            onClick={() => {
              setOpenConfiguration(!openConfiguration);
            }}
            size="sm">
            {t('manageMaterial.table.header.button.configure')}
          </Button>
        }
      />

      <CustomDataTable
        id="manage-material-table"
        type="normal"
        columns={columns}
        data={data || []}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        pagination={true}
        totalRocords={paginationConfig.totalElements}
        handleChangePage={handleChangePage}
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('manageMaterial.table.pagination.totalRecords')}
        paginationRecordsPerPageMessage={t('manageMaterial.table.pagination.perPage')}
        progressPending={isFetching}
        responsive={true}
        showCardView={showCardView}
        defaultExpandedCardView={true}
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
            error={isError ? t('manageMaterial.table.error') : null}
            image={EmptyDataImage}
            heading={t('manageMaterial.table.emptyData')}
            description={t('manageMaterial.table.emptyDataDescription')}
          />
        }
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
      {openDetails && (
        <FloatingDrawer
          open={true}
          anchor="right"
          onClose={() => setOpenDetails(!openDetails)}
          heading={t('manageMaterial.drawer.heading')}>
          <TherapyDetails
            therapyId={materialNumber}
            therapyData={MaterialDetailsConstants}
            configurationData={ConfigConstants}
            onClose={() => setOpenDetails(!openDetails)}
            showFooter={false}
            isMaterialConfiguration={true}
            useMaterialService={true}
            hasDeleteConfigAccess={!isCustomerCenter}
          />
        </FloatingDrawer>
      )}
      {openConfiguration && (
        <FloatingDrawer
          open={true}
          anchor="right"
          onClose={() => setOpenConfiguration(!openConfiguration)}
          heading={t('manageMaterial.drawer.configuration.heading')}>
          <ConfigureMaterials
            onClose={() => setOpenConfiguration(!openConfiguration)}
            onSuccess={() => setConfigureSuccess(true)}
            onError={() => setConfigureError(true)}
          />
        </FloatingDrawer>
      )}
    </React.Fragment>
  );
}

export default ManageMaterialTable;
