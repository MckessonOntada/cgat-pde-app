import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useCatalogContext } from '../context/CatalogContext';
import CommonUtils from '@src/util/CommonUtils';
import { Button } from '@mckesson/mcp-component-library';
import ConfigureCatalog from './ConfigureCatalog';
import CatalogDetails from './CatalogDetails';
import { Alert } from '@mckesson/mcp-component-library';

function CatalogDataTable(props) {
  const { t } = useTranslate();

  const { paginationConfig, catalogList: data, setPageNumber } = useCatalogContext();
  const [selectedCatalogs, setSelectedCatalogs] = useState([]);
  const [openConfigurationDraw, setOpenConfigurationDraw] = useState(false);
  const [openCatalogDetails, setOpenCatalogDetails] = useState(false);
  const [viewCatalog, setViewCatalog] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
  const [alert, setAlert] = useState(null);

  const getindeterminate = () => {
    const allDataIncluded = data.every((invoice) => selectedCatalogs.some((includedInvoice) => includedInvoice.id === invoice.id));
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
            el.indeterminate =
              row.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber && selectedCatalogs.length > 0 && !getindeterminate();
          }
        }}
      />
    );
  };
  const isChecked = (row) => {
    if (row.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber) {
      return getindeterminate();
    }
    let availableRow = selectedCatalogs.find((item) => item.id === row?.id);
    return !!availableRow;
  };
  const isAllChecked = () => {
    return selectedCatalogs.length === data.length;
  };
  const isCheckboxDisabled = (row) => {
    let isDisbled = row.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber && !CommonUtils.isNonEmptyArray(data);
    return isDisbled;
  };
  const handleRowSelected = (data) => {
    if (data.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber) {
      handleHeaderCheck(data);
    } else {
      handleIndividualCheck(data);
    }
  };
  const handleIndividualCheck = (data) => {
    if (selectedCatalogs.find((item) => item.id === data?.id)) {
      setSelectedCatalogs(selectedCatalogs.filter((item) => item.id !== data?.id));
      return;
    }
    setSelectedCatalogs([...selectedCatalogs, ...[data]]);
  };
  const handleHeaderCheck = () => {
    if (isAllChecked()) {
      setSelectedCatalogs([]);
    } else {
      if (paginationConfig.pageNumber === 1) {
        setSelectedCatalogs(data);
      } else {
        const allDataIncluded = data.every((invoice) => selectedCatalogs.some((includedInvoice) => includedInvoice.id === invoice.id));
        if (!allDataIncluded) {
          setSelectedCatalogs([...selectedCatalogs, ...data]);
        } else {
          setSelectedCatalogs(selectedCatalogs.filter((item) => !data.some((invoice) => invoice.id === item.id)));
        }
      }
    }
  };

  const columns = [
    {
      id: 'checkbox',
      name: renderCheckBox({ id: 'ALL_PATIENTS_' + paginationConfig.pageNumber }),
      sortable: false,
      cell: (row, index) => renderCheckBox(row, index),
      selector: (row) => row.MRN,
      width: '50px'
    },
    {
      name: t('ManageCatalog.Table.SAPMaterialID'),
      id: 'sapMaterial',
      selector: (row) => {},
      wrap: true,
      minWidth: '112px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}
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
      minWidth: '100px',
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props?.materialDescriptionInLanguageEn || '-'}</div>
    },
    {
      id: 'ndc',
      name: t('ManageCatalog.Table.NDC'),
      selector: (row) => {},
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.ndc || '-'}</div>
    },
    {
      id: 'distChannel',
      name: t('ManageCatalog.Table.DistChannel'),
      selector: (row) => {},
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.distChannel || '-'}</div>
    },
    {
      id: 'variant',
      name: t('ManageCatalog.Table.Variant'),
      selector: (row) => {},
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.variant || '-'}</div>
    },
    {
      id: 'soldToCustomer',
      name: t('ManageCatalog.Table.Soldto'),
      selector: (row) => {},
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.soldToCustomer || '-'}</div>
    },
    {
      id: '',
      name: t('ManageCatalog.Table.Shipto'),
      selector: (row) => {},
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.shipToCustomer || '-'}</div>
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };
  const showAlert = (type, message) => {
    setAlert({ type });
    setIsAlertVisible(true);
    setAlertDescription(message);
    const timer = setTimeout(() => {
      setIsAlertVisible(false);
      setAlert({ type: '', description: '' });
    }, 10000);

    // Cleanup the timer to prevent memory leaks
    return () => clearTimeout(timer);
  };

  return (
    <div>
      {selectedCatalogs?.length > 0 && (
        <div className="selected-item-alert">
          <p className="selected-item-text">
            {selectedCatalogs?.length} {t('orgManagement.selected_items')}
          </p>
          <Button variant="secondary" onClick={() => setOpenConfigurationDraw(true)}>
            {t('ManageCatalog.Button.Configure')}
          </Button>
        </div>
      )}
      {isAlertVisible && (
        <div className="alert-container">
          <Alert description={alertDescription} onClose={handleAlertClose} type={alert.type} duration={10000} />
        </div>
      )}
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
            heading={t('ManageCatalog.Table.nodata')}
            description={t('ManageCatalog.Table.nodataMsg')}
          />
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
