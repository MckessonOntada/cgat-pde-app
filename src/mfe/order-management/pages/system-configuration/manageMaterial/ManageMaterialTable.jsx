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

  const getindeterminate = () => {
    const allDataIncluded = data.every((invoice) =>
      selectedMaterials.some((includedInvoice) => includedInvoice.materialNumber === invoice.materialNumber)
    );
    return allDataIncluded;
  };

  const renderCheckBox = (row, index) => {
    return (
      <input
        data-testid="rowcheckbox"
        type="checkbox"
        id={'checkbox' + row?.id}
        disabled={isCheckboxDisabled(row)}
        onChange={() => handleRowSelected(row)}
        checked={isChecked(row)}
        ref={(el) => {
          if (el) {
            el.indeterminate = row.id === 'ALL_ITEMS_' + paginationConfig.pageNumber && selectedMaterials.length > 0 && !getindeterminate();
          }
        }}
      />
    );
  };

  const isChecked = (row) => {
    if (row.id === 'ALL_ITEMS_' + paginationConfig.pageNumber) {
      return getindeterminate();
    }
    let availableRow = selectedMaterials.find((item) => item.materialNumber === row?.materialNumber);
    return !!availableRow;
  };

  const isAllChecked = () => {
    return selectedMaterials.length === data.length;
  };

  const isCheckboxDisabled = (row) => {
    let isDisbled = row.id === 'ALL_ITEMS_' + paginationConfig.pageNumber && !CommonUtils.isNonEmptyArray(data);
    return isDisbled;
  };

  const handleRowSelected = (data) => {
    if (data.id === 'ALL_ITEMS_' + paginationConfig.pageNumber) {
      handleHeaderCheck(data);
    } else {
      handleIndividualCheck(data);
    }
  };

  const handleIndividualCheck = (data) => {
    if (selectedMaterials.find((item) => item.materialNumber === data?.materialNumber)) {
      setSelectedMaterials(selectedMaterials.filter((item) => item.materialNumber !== data?.materialNumber));
      return;
    }
    setSelectedMaterials([...selectedMaterials, ...[data]]);
  };

  const handleHeaderCheck = () => {
    if (isAllChecked()) {
      setSelectedMaterials([]);
    } else {
      if (paginationConfig.pageNumber === 1) {
        setSelectedMaterials(data);
      } else {
        const allDataIncluded = data.every((invoice) =>
          selectedMaterials.some((includedInvoice) => includedInvoice.materialNumber === invoice.materialNumber)
        );
        if (!allDataIncluded) {
          setSelectedMaterials([...selectedMaterials, ...data]);
        } else {
          setSelectedMaterials(selectedMaterials.filter((item) => !data.some((invoice) => invoice.materialNumber === item.materialNumber)));
        }
      }
    }
  };

  const columns = [
    {
      id: 'checkbox',
      name: renderCheckBox({ id: 'ALL_ITEMS_' + paginationConfig.pageNumber }),
      // sortable: false,
      cell: (row, index) => renderCheckBox(row, index),
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
      <TableHeading heading={'Material Listing'} />
      {selectedMaterials.length > 0 && (
        <div className="selected-invoices">
          <div className="label">{`${selectedMaterials.length} ${t('manageMaterial.table.header.text')}`}</div>
          <Button
            variant="secondary"
            onClick={() => {
              setOpenConfiguration(!openConfiguration);
            }}
            size="sm">
            {t('manageMaterial.table.header.button.configure')}
          </Button>
        </div>
      )}
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
        <FloatingDrawer open={true} anchor="right" onClose={() => setOpenDetails(!openDetails)}>
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
        <FloatingDrawer open={true} anchor="right" onClose={() => setOpenConfiguration(!openConfiguration)}>
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
