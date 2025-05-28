import React, { useState } from 'react';
import CommonFilters from '@src/components/Filters';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { Button } from '@mckesson/mcp-component-library';
import { getColumns } from './TableColumns';
import { ReactComponent as EmptyProviderTable } from '@src/assets/svg/EmptyProviderTable.svg';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { ReactComponent as FileUploadIcon } from '@src/assets/svg/upload.svg';
import { ReactComponent as ErrorIcon } from '@src/assets/svg/ErrorCircleFilled.svg';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';

import { useFilters, usePagination, useSelection, useSort, useTable } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate } from 'react-router-dom';
import SPMaterialDetails from '@src/mfe/core-config/system-admin/manage-sp-material/pages/SPMaterialDetails';
import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import CommonUtils from '@src/util/CommonUtils';
import TableHeading from '@src/components/tableHeading/TableHeading';
import ConfigureCatalog from '../../../manage-catalog/pages/ConfigureCatalog';
import AuthUtils from '@src/util/AuthUtils';

const CatalogList = ({ selectedAccount, selectedOrganization, sendNotification }) => {
  const { filters, applyFilters, clearFilters } = useFilters();
  const navigate = useNavigate();
  const [openSPMaterialDetails, setOpenSPMaterialDetails] = useState(false);
  const [viewSPMaterial, setViewSPMaterial] = useState(null);

  const [openConfigurationDraw, setOpenConfigurationDraw] = useState(false);
  const { pagination, changePage } = usePagination();
  const { t } = useTranslate();
  const { data = [], refreshTable, requestParams } = useTable();
  const { applySort } = useSort();
  const dispatch = useDispatch();
  const { selectedRows, deselectAll, selectedRowObjects, setSelectedRowObjects, setSelection } = useSelection();
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const additionalFiltersConfig = React.useMemo(() => {
    return [];
  }, []);

  const handleOnClick = (url) => () => navigate(url, { state: { selectedAccount, selectedOrganization } });
  const handleOnSort = (field, direction) => {
    const { sortKey } = field;
    if (sortKey && direction) {
      applySort(sortKey, direction);
    }
  };
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);
  const clearTableSelection = () => {
    deselectAll(); // clears selectedRows and selectedRowObjects
  };
  const { mutate } = useMutation({
    mutationFn: (payload) => SPCatalogService.deLinkCatalogs(payload),
    onSuccess: (response) => {
      if (response.status == 200) {
        sendNotification({
          type: 'success',
          description: t('SPCatalog.deLinkSuccess')
        });
      }
      deselectAll();
      refreshTable();
    },
    onError: (error) => {
      const { response: errorResponse } = error;
      if (errorResponse.response.data?.errorCodes && errorResponse.response.data?.errorCodes.length > 0) {
        errorResponse.response.data.errorCodes.forEach((error) => {
          sendNotification({
            type: 'error',
            description: t(`SPCatalog.deLinkFailure.${error}`)
          });
        });
      }
    }
  });

  const onDeLinkConfirmation = (payload) => {
    const state = {};
    state.title = t('SPCatalog.deLinkConfirmationTitle');
    state.body = <div className="MCP-modal-body">{t('SPCatalog.deLinkConfirmationDescription')}</div>;
    state.footer = (
      <div className="controls">
        <Button onClick={() => dispatch(closeModal())} variant="secondary" size="md">
          {t('provider.btnCancel')}
        </Button>
        <Button
          onClick={() => {
            dispatch(closeModal());
            mutate(payload);
          }}
          size="md">
          {t('provider.btnDeLink')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  const handleOnOptionSelection = (action, row) => {
    if (action == 'unlink') {
      const { sapMaterial, soldToCustomer } = row;
      const payload = [{ sapMaterial, soldToCustomer }];
      onDeLinkConfirmation(payload);
    } else if (action == 'configure') {
      setSelection([row]);
      setOpenConfigurationDraw(true);
    }
  };

  const handleOnDeLink = () => {
    const payload = Array.from(selectedRows).map((id) => {
      const row = data.find((item) => item.id === id);
      return {
        sapMaterial: row.sapMaterial,
        soldToCustomer: row.soldToCustomer
      };
    });
    onDeLinkConfirmation(payload);
  };
  const exportList = () => {
    requestParams.accountIds = requestParams.accountNumbers;
    delete requestParams.accountNumbers;
    handleexportList(requestParams);
  };
  const { mutate: handleexportList } = useMutation(
    async (requestParams) => {
      return SPCatalogService.downloadSpCatalogList(requestParams);
    },
    {
      onSuccess: (response) => {
        sendNotification({
          type: 'success',
          description: t('label.sPCatalogListingDownload')
        });
        CommonUtils.downloadFile(new Blob([response], { type: 'text/csv;charset=utf-8;' }), 'Catalog_list');
      },
      onError: () => {
        sendNotification({
          type: 'error',
          description: t('manageSPMaterial.messages.button.downloadFail')
        });
      }
    }
  );
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-CardContainer">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={additionalFiltersConfig}
          searchPlaceholder={t('controls.placeholder.searchSPCatalogPlaceholder')}
        />
      </div>

      <TableHeading
        heading={t('label.sPCatalogListing')}
        controls={
          <div className="controls">
            <Button variant="secondary" className="button-icon" onClick={exportList} disabled={!(data.length > 0)} size="md">
              {t('controls.downloadList')}
            </Button>
            <Button Icon={FileUploadIcon} className="button-icon" onClick={handleOnClick('upload')} size="md">
              {t('controls.uploadCatalog')}
            </Button>
            <Button Icon={AddCircleFilled} className="button-icon" onClick={handleOnClick('link-sp-material')} disabled={false} size="md">
              {t('controls.linkCatalog')}
            </Button>
          </div>
        }
        secondaryView={selectedRows.size > 0}
        secondaryViewHeading={`${selectedRows.size} ${t('userManagement.selected_items')}`}
        secondaryViewControls={
          <div className="controls">
            <Button variant="secondary" onClick={() => setOpenConfigurationDraw(true)}>
              {t('SPCatalog.Configuration')}
            </Button>
            <Button variant="secondary" onClick={handleOnDeLink}>
              {t('provider.btnUnlink')}
            </Button>
          </div>
        }
      />

      <CustomDataTable
        id="provider-list-table"
        columns={getColumns({
          setOpenSPMaterialDetails,
          setViewSPMaterial,
          onDeLinkConfirmation,
          handleOnOptionSelection,
          isCustomerCenter
        })}
        data={data}
        handleChangePage={(_event, pageNumber) => changePage(pageNumber)}
        onSortIconClick={handleOnSort}
        pagination={true}
        currentPage={pagination.pageNumber}
        totalPageCount={pagination.totalPages}
        totalRocords={pagination.totalElements}
        recordsPerPage={pagination.pageSize}
        paginationRecordsPerPageMessage={t('labels.perPage')}
        paginationTotalRecorsMessage={t('labels.results')}
        noDataComponent={
          <ErrorBanner image={<EmptyProviderTable />} heading={t('label.spCatalogDataGrid')} description={t('label.spCatalogDataGridDescription')} />
        }
      />
      <SPMaterialDetails
        openSPMaterialDetails={openSPMaterialDetails}
        setOpenSPMaterialDetails={setOpenSPMaterialDetails}
        viewSPMaterial={viewSPMaterial}
        isSPCatalog={true}
        sendNotification={sendNotification}
      />
      <ConfigureCatalog
        openConfigurationDraw={openConfigurationDraw}
        setOpenConfigurationDraw={setOpenConfigurationDraw}
        selectedCatalogs={selectedRowObjects}
        showAlert={sendNotification}
        isSPCatalog={true}
        clearTableSelection={clearTableSelection}
      />
    </div>
  );
};

export default CatalogList;

const ErrorBanner = ({ heading, description, image }) => {
  const { isLoading, isError, error } = useTable();
  if (isLoading) {
    return (
      <div className="dashboard-loader">
        <Loader variant="circular" />
      </div>
    );
  }
  let headingContent, descriptionContent, thumbnail;
  if (isError) {
    headingContent = 'Some error has occurred';
    descriptionContent = error.message;
    thumbnail = <ErrorIcon />;
  } else {
    headingContent = heading;
    descriptionContent = description;
    thumbnail = image;
  }
  return (
    <div className="table-notification">
      <div className="MCP-module-wrapper">
        <div className="MCP-module-body">
          {thumbnail}
          <p className="heading">{headingContent}</p>
          <p>{descriptionContent}</p>
        </div>
      </div>
    </div>
  );
};
