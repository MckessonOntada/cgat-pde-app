import ModuleHeader from '@src/components/module-header';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { ReactComponent as FileUploadIcon } from '@src/assets/svg/upload.svg';
import React, { useState } from 'react';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useLocation, useNavigate } from 'react-router-dom';
import CommonFilters from '@src/components/Filters';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { getColumns } from './TableColumns';
import { ReactComponent as EmptyProviderTable } from '@src/assets/svg/EmptyProviderTable.svg';
import { ReactComponent as ErrorIcon } from '@src/assets/svg/ErrorCircleFilled.svg';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import { ConfigConstants, MaterialDetailsConstants } from '@src/mfe/core-config/system-admin/manage-material/assets/constants/MaterialConstants';

import SPCrosswalkService from '@src/api/commonService/SPCrosswalkService';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import SPMaterialDetails from '@src/mfe/core-config/system-admin/manage-sp-material/pages/SPMaterialDetails';
import { useFilters, usePagination, useSort, useTable } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';

const List = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { filters, applyFilters, clearFilters } = useFilters();
  const { pagination, changePage } = usePagination();
  const [openDetails, setOpenDetails] = useState(false);
  const [materialNumber, setMaterialNumber] = useState(null);
  const [openSPMaterialDetails, setOpenSPMaterialDetails] = useState(false);
  const [viewSPMaterial, setViewSPMaterial] = useState(null);
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const { data = [], refreshTable } = useTable();
  const dispatch = useDispatch();
  const { applySort } = useSort();
  const { items: notifications, remove: removeNotification, removeAll, add: addNotification } = useTimedArray(10000);
  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.systemAdmin'),
        url: '/admin'
      },
      {
        label: t('breadcrumb.systemConfiguration'),
        url: '/system-admin'
      },
      {
        label: t('label.materialCrosswalk')
      }
    ];
  }, [isSystemAdminView]);

  React.useEffect(() => {
    const { state } = location;
    if (state?.items) {
      state.items.map((item) => {
        addNotification({ ...item });
      });
      navigate(location.pathname, { replace: true });
    }
  }, []);

  const handleOnClick = (url) => () => navigate(url);

  const handleOnSort = (data, direction) => {
    const { sortKey } = data;
    if (sortKey && direction) {
      applySort(sortKey, direction);
    }
  };

  const handleOnConfirmation = (id) => {
    SPCrosswalkService.deLinkCrosswalk(id)
      .then((response) => {
        if (response.status === 200) {
          addNotification({
            type: 'success',
            description: t('SPCrosswalk.unlinkCrosswalkSuccess')
          });
          refreshTable();
        }
      })
      .catch((error) => {
        const { response: errorResponse } = error;
        if (errorResponse.response.data?.errorCodes && errorResponse.response.data?.errorCodes.length > 0) {
          errorResponse.response.data.errorCodes.forEach((error) => {
            addNotification({
              type: 'error',
              description: t(`SPCrosswalk.deLinkFailure.${error}`)
            });
          });
        } else {
          addNotification({
            type: 'error',
            description: t(`SPCrosswalk.deLinkFailure.generic`)
          });
        }
      });
  };

  const confirmationUnlink = (id) => () => {
    const state = {};
    state.title = `${t('label.unlinkCrosswalk')}`;
    state.body = (
      <div className="MCP-modal-body">
        <p>{t('label.unlinkCrosswalkDescription')}</p>
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
          {t('button.caption.no')}
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            handleOnConfirmation(id);
            dispatch(closeModal());
          }}>
          {t('button.caption.yes')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <ModuleHeader
        heading={<Heading as="h1">{t('label.materialCrosswalk')}</Heading>}
        controls={
          <div className="controls">
            <Button Icon={AddCircleFilled} className="button-icon" onClick={handleOnClick('create')} size="md">
              {t('controls.addCrosswalk')}
            </Button>
            <Button Icon={FileUploadIcon} className="button-icon" onClick={handleOnClick('upload')} size="md">
              {t('controls.uploadCrosswalk')}
            </Button>
          </div>
        }
      />
      {notifications && notifications.length > 0 && (
        <div className="MCP-module-body">
          {notifications.map((item, index) => {
            return <Alert key={item.id} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />;
          })}
        </div>
      )}

      <div className="MCP-CardContainer">
        <div className="MCP-CardContainer">
          <CommonFilters
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            additionalFilters={[]}
            searchPlaceholder={t('controls.placeholder.materialCrosswalk')}
          />
        </div>
        <ModuleHeader heading={<Heading as="h2">{t('label.materialCrosswalkListing')}</Heading>} />
        <CustomDataTable
          id="provider-list-table"
          type={'normal'}
          columns={getColumns({
            setOpenDetails,
            setMaterialNumber,
            setOpenSPMaterialDetails,
            setViewSPMaterial,
            confirmationUnlink
          })}
          data={data}
          handleChangePage={(_event, pageIndex) => {
            changePage(pageIndex);
          }}
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
              heading={t('controls.addMaterialCrosswalk')}
              description={t('label.emptyMaterialCrosswalkTableDescription')}
            />
          }
        />

        {openDetails && (
          <TherapyDetails
            therapyId={materialNumber}
            therapyData={MaterialDetailsConstants}
            configurationData={ConfigConstants}
            onClose={() => setOpenDetails(!openDetails)}
            showFooter={false}
            isMaterialConfiguration={true}
            useMaterialService={true}
            hasDeleteConfigAccess={!isCustomerCenter}
            heading={t('manageMaterial.drawer.heading')}
          />
        )}

        <SPMaterialDetails openSPMaterialDetails={openSPMaterialDetails} setOpenSPMaterialDetails={setOpenSPMaterialDetails} viewSPMaterial={viewSPMaterial} />
      </div>
    </div>
  );
};

export default List;

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
