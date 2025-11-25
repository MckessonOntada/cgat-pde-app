import { Button, Heading, Loader } from '@mckesson/mcp-component-library';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import SelectedAccounts from '@src/components/Accounts/SelectedAccounts';
import { CustomDataTable } from '@src/components/dataTableComponent';
import EmptyDataTable from '@src/components/EmptyTable';
import ModuleHeader from '@src/components/module-header';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { useTranslate } from '@src/translations/useTranslation';
import AuthUtils from '@src/util/AuthUtils';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSPMaterial } from '../context/SPMaterialContext';
import '../manageSPMaterial.scss';
import { routeConstants } from '../routes/constants';
import ConfigureSPMaterials from './ConfigureSPMaterials';
import ConfigureSPPrescription from './ConfigureSPPrescription';
import { getLinkSPMaterialColumns, getSPMaterialColumns } from './SPMaterialColumns';
import SPMaterialDetails from './SPMaterialDetails';

function SPMaterialDataTable({ isLinkCatalog = false, onSuccess, onError, setAlert }) {
  const { t } = useTranslate();
  const { paginationConfig, data, setPageNumber, isLoading, applySort, selectedSPMaterial, setSelectedSPMaterial, filteredData, clearFilters } =
    useSPMaterial();
  const [openSPMaterialDetails, setOpenSPMaterialDetails] = useState(false);
  const [openConfiguration, setOpenConfiguration] = React.useState({
    config: false,
    prescriptionConfig: false
  });
  const [viewSPMaterial, setViewSPMaterial] = useState(null);
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const [tableHeight, setTableHeight] = useState('100%');
  const [configureRow, setConfigureRow] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAssociatedAccount = location.state?.isAssociatedAccount;

  const updatedData = data.map((item) => ({
    ...item,
    active: item.itemStatus === 'A' ? true : false
  }));
  const handleOnOptionSelection = (value, row) => {
    if (value === 'DXConfiguration') {
      handleDXConfiguration([row]);
    }
    if (value === 'configure') {
      setOpenConfiguration((prev) => ({
        ...prev,
        config: !prev.config
      }));
      setConfigureRow([row]);
    }
  };

  useEffect(() => {
    if (location.state?.alert?.type && location.state?.alert?.messages) {
      setAlert({
        type: location.state.alert.type,
        description: location.state.alert.messages
      });
    }
  }, [location, setAlert]);
  const columns = getSPMaterialColumns({
    t,
    paginationConfig,
    updatedData,
    selectedSPMaterial,
    setSelectedSPMaterial,
    setViewSPMaterial,
    setOpenSPMaterialDetails,
    isLinkCatalog,
    handleOnOptionSelection
  });

  const linkSpColumns = getLinkSPMaterialColumns({
    t,
    paginationConfig,
    updatedData,
    selectedSPMaterial,
    setSelectedSPMaterial,
    setViewSPMaterial,
    setOpenSPMaterialDetails,
    isLinkCatalog,
    handleOnOptionSelection
  });

  useEffect(() => {
    setTimeout(() => {
      let eleHeight = document.getElementById('data-table-sp-material-table')?.offsetHeight;
      setTableHeight(eleHeight);
    }, 100);
  }, [data]);

  useEffect(() => {
    clearFilters();
    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: null
    });
  }, [isAssociatedAccount]);

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const onRemoveSelectedSPMaterial = useCallback(
    (item) => {
      const updatedList = selectedSPMaterial.filter((SPMaterial) => SPMaterial.id !== item.id);
      setSelectedSPMaterial(updatedList);
      if (isLinkCatalog) setSelectedSPMaterial(updatedList);
    },
    [selectedSPMaterial, isLinkCatalog, setSelectedSPMaterial]
  );
  const handleSelectAll = () => {
    const merged = [...selectedSPMaterial, ...data.filter((newItem) => !selectedSPMaterial.some((existing) => existing.id === newItem.id))];
    setSelectedSPMaterial(merged);
  };
  const handleClearAll = () => {
    setSelectedSPMaterial([]);
  };

  const handleNotification = (notification) => {
    if (notification.type === 'error') {
      onError && onError(notification);
    } else {
      onSuccess && onSuccess(notification);
    }
  };

  const isMultipleSelected = selectedSPMaterial?.length > 1;
  const handleDXConfiguration = (selectedSPMaterial) => {
    if (selectedSPMaterial && Array.isArray(selectedSPMaterial) && selectedSPMaterial[0])
      navigate(routeConstants.DIAGNOSIS_CODE, {
        state: { therapy: selectedSPMaterial[0] }
      });
  };
  const handleConfiguration = (selectedSPMaterial) => {
    if (selectedSPMaterial && Array.isArray(selectedSPMaterial) && selectedSPMaterial[0])
      navigate(routeConstants.CONFIGURE, {
        state: { therapy: selectedSPMaterial, materialType: 'sp' }
      });
  };

  return (
    <div>
      {isLinkCatalog ? (
        <div style={{ marginBottom: '24px', marginTop: '16px' }}>
          <ModuleHeader
            heading={<Heading as="h2">{t('SPCatalog.SelectSPMaterial')}</Heading>}
            controls={
              !isCustomerCenter && (
                <div className="controls">
                  {
                    <>
                      <Button className="button-icon" textButton size="md" onClick={handleClearAll}>
                        {t('SPCatalog.Material.clearall')}
                      </Button>
                      <Button className="button-icon" variant="secondary" size="md" onClick={handleSelectAll}>
                        {t('SPCatalog.Material.selectall')}
                      </Button>
                    </>
                  }
                </div>
              )
            }
          />
        </div>
      ) : (
        <TableHeading
          heading={t('manageSPMaterial.heading.materialListing')}
          secondaryView={selectedSPMaterial?.length}
          secondaryViewHeading={`${selectedSPMaterial?.length} ${t('manageMaterial.table.header.text')}`}
          secondaryViewControls={
            <div className="controls">
              {!isMultipleSelected && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleDXConfiguration(selectedSPMaterial);
                    }}
                    size="sm">
                    {t('manageMaterial.table.header.button.DXConfiguration')}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setOpenConfiguration((prev) => ({
                        ...prev,
                        prescriptionConfig: !prev.prescriptionConfig
                      }));
                    }}
                    size="sm">
                    {t('manageMaterial.table.header.button.prescriptionDetails')}
                  </Button>
                </>
              )}

              <Button
                variant="secondary"
                onClick={() => {
                  handleConfiguration(selectedSPMaterial);
                }}
                size="sm">
                {t('manageMaterial.table.header.button.configure')}
              </Button>
            </div>
          }
          style={{ marginBottom: '16px' }}
        />
      )}
      <div className="accountBox">
        <div className="customTableBox">
          <CustomDataTable
            id="sp-material-table"
            type="normal"
            columns={isLinkCatalog ? linkSpColumns : columns}
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
                heading={filteredData ? t('errors.messages.noRecordsFound') : t('manageSPMaterial.messageemptyTableTitle')}
                description={!filteredData && t('manageSPMaterial.messages.emptyTableSubtitle')}
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
        </div>
        {isLinkCatalog && (
          <div className="selectedAccountBox" style={{ height: tableHeight }}>
            <SelectedAccounts
              selectedAccounts={selectedSPMaterial}
              onRemoveAccount={onRemoveSelectedSPMaterial}
              header={t('SPCatalog.SelectedMaterial')}
              isLinkCatalog={true}
            />
          </div>
        )}
      </div>
      <SPMaterialDetails
        openSPMaterialDetails={openSPMaterialDetails}
        setOpenSPMaterialDetails={setOpenSPMaterialDetails}
        viewSPMaterial={viewSPMaterial}
        sendNotification={handleNotification}
      />
      {/* {openConfiguration && <ConfigureSPMaterials onClose={() => setOpenConfiguration(!openConfiguration)} onSuccess={onSuccess} onError={onError} />} */}
      {openConfiguration.config && (
        <ConfigureSPMaterials
          configureRow={configureRow}
          onClose={() => setOpenConfiguration((prev) => ({ ...prev, config: false }))}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
      {openConfiguration.prescriptionConfig && (
        <ConfigureSPPrescription
          onClose={() => setOpenConfiguration((prev) => ({ ...prev, prescriptionConfig: false }))}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
    </div>
  );
}
export default SPMaterialDataTable;
