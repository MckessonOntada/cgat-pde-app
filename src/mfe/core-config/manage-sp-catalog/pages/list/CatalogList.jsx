import React, { useState } from 'react';
import CommonFilters from '@src/components/Filters';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import { getColumns } from './TableColumns';
import { ReactComponent as EmptyProviderTable } from '@src/assets/svg/EmptyProviderTable.svg';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { ReactComponent as FileUploadIcon } from '@src/assets/svg/upload.svg';
import { ReactComponent as ErrorIcon } from '@src/assets/svg/ErrorCircleFilled.svg';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';

import { useFilters, usePagination, useSelection, useSort, useTable } from '@src/mfe/core-config/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useNavigate } from 'react-router-dom';
import SPMaterialDetails from '@src/mfe/order-management/pages/system-configuration/manage-spmaterial/pages/SPMaterialDetails';
import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import { useOrgAccountsMultiSelectionContext } from '../context/OrgAccountMultiSelectContext';

const CatalogList = ({ selectedAccount, selectedOrganization }) => {
  const { filters, applyFilters, clearFilters } = useFilters();
  const navigate = useNavigate();
  const [openSPMaterialDetails, setOpenSPMaterialDetails] = useState(false);
  const [viewSPMaterial, setViewSPMaterial] = useState(null);
  const { pagination, changePage } = usePagination();
  const { t } = useTranslate();
  const { data = [], refreshTable } = useTable();
  const { applySort } = useSort();
  const dispatch = useDispatch();
  const { selectedRows, deselectAll } = useSelection();

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
  const { mutate } = useMutation({
    mutationFn: (payload) => SPCatalogService.deLinkCatalogs(payload),
    onSuccess: (response) => {
      if (response.status == 200) {
        addNotification({
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
          addNotification({
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
      <ModuleHeader
        heading={<Heading as="h2">{t('label.sPCatalogListing')}</Heading>}
        controls={
          <div className="controls">
            <Button variant="secondary" className="button-icon" onClick={handleOnClick('upload')} disabled={true} size="md">
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
      />
      {notifications?.length > 0 && (
        <div className="alert-container">
          <div className="MCP-module-body">
            {notifications.map((item, index) => (
              <Alert key={item.id} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />
            ))}
          </div>
        </div>
      )}
      {selectedRows.size > 0 && (
        <div className="table-selection-ribbon">
          <p>{`${selectedRows.size} Item${selectedRows.size > 1 ? 's' : ''} selected`}</p>
          <Button variant="secondary" size="sm" onClick={handleOnDeLink}>
            {t('provider.btnUnlink')}
          </Button>
        </div>
      )}
      <CustomDataTable
        id="provider-list-table"
        columns={getColumns({
          setOpenSPMaterialDetails,
          setViewSPMaterial,
          onDeLinkConfirmation
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
          <ErrorBanner
            image={<EmptyProviderTable />}
            heading={t('label.spCatalogDataGrid')}
            description={t('label.spCatalogDataGridDescription')}
          />
        }
      />
      <SPMaterialDetails
        openSPMaterialDetails={openSPMaterialDetails}
        setOpenSPMaterialDetails={setOpenSPMaterialDetails}
        viewSPMaterial={viewSPMaterial}
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
