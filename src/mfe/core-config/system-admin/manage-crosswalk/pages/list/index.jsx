import ModuleHeader from '@src/components/module-header';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { ReactComponent as FileUploadIcon } from '@src/assets/svg/upload.svg';
import React, { useState } from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
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
import Alert from '@src/components/cgat-alert/Alert';
import TherapyDetailsWithTabs from '@src/components/therapyDetails/TherapyDetailsWithTabs';
import { ChannelType } from '../../../manage-sp-account/util';

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
  const { data = [], refreshTable, fileteredData } = useTable();
  const dispatch = useDispatch();
  const { applySort } = useSort();
  const [notification, setNotification] = useState(null);
  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.systemAdmin'),
        url: '/admin'
      },
      {
        label: t('breadcrumb.systemConfiguration'),
        url: '/system-admin/config'
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
        setNotification({ ...item });
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
          setNotification({
            type: 'success',
            description: t('SPCrosswalk.unlinkCrosswalkSuccess')
          });
          refreshTable();
        }
      })
      .catch((error) => {
        const { response: errorResponse } = error;
        console.log('error', error);
        setNotification({
          type: 'error',
          description: t('errors.default')
        });
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
      {notification && <Alert description={notification.description} onClose={() => setNotification(null)} type={notification.type} />}

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
              heading={!fileteredData ? t('controls.addMaterialCrosswalk') : t('errors.messages.noRecordsFound')}
              description={!fileteredData && t('label.emptyMaterialCrosswalkTableDescription')}
            />
          }
        />

        {openDetails && (
          <TherapyDetailsWithTabs
            isMaterialListing={false}
            channelType={ChannelType.BUY_AND_BILL}
            trade={materialNumber}
            onSelect={() => {}}
            onClose={() => setOpenDetails(!openDetails)}
            heading={t('manageMaterial.drawer.details.heading')}
            showFooter={false}
            isDetailsByNdc={true}
          />
        )}

        <SPMaterialDetails
          openSPMaterialDetails={openSPMaterialDetails}
          setOpenSPMaterialDetails={setOpenSPMaterialDetails}
          viewSPMaterial={viewSPMaterial}
          isCrosswalk={true}
        />
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
