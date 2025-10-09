import ModuleHeader from '@src/components/module-header';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { ReactComponent as FileUploadIcon } from '@src/assets/svg/upload.svg';
import PermittedComponent from '@src/components/permitted-component';
import React, { useEffect, useState } from 'react';
import { Button, Heading, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useLocation, useNavigate } from 'react-router-dom';
import CommonFilters from '@src/components/Filters';
import { PROVIDER_STATUS } from '../../config';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { useFilters, usePagination, useSelection, useSort, useTable } from '../../context/TableContext';
import { getColumns } from './TableColumns';
import { ReactComponent as EmptyProviderTable } from '@src/assets/svg/EmptyProviderTable.svg';
import { ReactComponent as ErrorIcon } from '@src/assets/svg/ErrorCircleFilled.svg';
import CommonUtils, { checkIsDataFiltered } from '@src/util/CommonUtils';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import TableHeading from '@src/components/tableHeading/TableHeading';
import Alert from '@src/components/cgat-alert/Alert';

const List = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const { filters, applyFilters, clearFilters } = useFilters();
  const isDataFiltered = React.useMemo(() => {
    return checkIsDataFiltered(filters);
  }, [filters]);
  const { selectedRows } = useSelection();
  const { applySort } = useSort();
  const { data = [] } = useTable();
  const { pagination, changePage } = usePagination();
  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.admin'),
        url: isSystemAdminView ? '/' : '/admin'
      },
      {
        label: t('label.providers')
      }
    ];
  }, [isSystemAdminView]);
  const additionalFiltersConfig = React.useMemo(() => {
    return [
      {
        type: 'dropdown',
        name: 'status',
        label: t('captions.status'),
        options: Object.entries(PROVIDER_STATUS).map(([key, value]) => ({
          label: t(`providerStatus.${key}`),
          value: value.toUpperCase()
        }))
      }
    ];
  }, []);
  useEffect(() => {
    if (location.state?.type && location.state?.messages) {
      setNotification({
        type: location.state.type,
        description: location.state.messages
      });
      navigate(`${location.pathname}${location.search}`, {
        replace: true,
        state: null
      });
    }
  }, [location, navigate]);
  const handleOnSort = (column, sortDirection) => {
    applySort(column.sortKey, sortDirection);
  };
  React.useEffect(() => {
    const { state } = location;
    if (state?.items) {
      state.items.map((item) => {
        setNotification({ ...item });
      });
      navigate(location.pathname, { replace: true });
    }
  }, []);

  const handleOnLinkSpAccounts = () => {
    const searchParams = Array.from(selectedRows).join(',');
    let url = `link-sp-accounts?accounts=${searchParams}`;
    if (selectedRows.size === 1) {
      const selectedId = Array.from(selectedRows)[0];
      const selectedRowData = data.find((row) => row.id === selectedId);
      const name = CommonUtils.getFullName(selectedRowData?.name);

      if (selectedRowData?.name) {
        url += `&name=${name}`;
      }
    }

    navigate(url);
  };

  const handleOnClick = (url) => () => navigate(url);
  const { pageNo, totalElements, totalPages, pageSize } = pagination;
  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <ModuleHeader
        heading={<Heading as="h1">{t('label.providers')}</Heading>}
        controls={
          <div className="controls">
            <PermittedComponent permissions={PERMISSIONS_ENUM.MANAGE_PROVIDERS.UPLOAD_PROVIDER}>
              <Button Icon={FileUploadIcon} className="button-icon" onClick={handleOnClick('upload-providers')} size="md">
                {t('controls.uploadProviders')}
              </Button>
            </PermittedComponent>
            <PermittedComponent permissions={PERMISSIONS_ENUM.MANAGE_PROVIDERS.ADD_PROVIDER}>
              <Button Icon={AddCircleFilled} className="button-icon" onClick={handleOnClick('create')} size="md">
                {t('controls.addProviders')}
              </Button>
            </PermittedComponent>
          </div>
        }
      />
      {notification && <Alert description={notification.description} onClose={() => setNotification(null)} type={notification.type} />}

      <div className="MCP-CardContainer">
        <div className="MCP-CardContainer">
          <CommonFilters
            autoFocus={true}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            additionalFilters={additionalFiltersConfig}
            searchPlaceholder={t('controls.placeholder.searchProviderPlaceholder')}
          />
        </div>
        <TableHeading
          heading={t('label.providerListing')}
          secondaryView={selectedRows.size > 0}
          secondaryViewHeading={`${selectedRows.size} ${t('orgManagement.selected_items')}`}
          secondaryViewControls={
            <PermittedComponent permissions={[PERMISSIONS_ENUM.MANAGE_PROVIDERS.MANAGE_PROVIDERS_SCREEN]}>
              <Button variant="secondary" size="sm" onClick={handleOnLinkSpAccounts}>
                {t('provider.linkSpAccounts')}
              </Button>
            </PermittedComponent>
          }
        />
        <CustomDataTable
          id="provider-list-table"
          columns={getColumns(setNotification)}
          data={data}
          handleChangePage={(_event, pageIndex) => changePage(pageIndex)}
          onSortIconClick={handleOnSort}
          pagination={true}
          currentPage={pageNo}
          totalPageCount={totalPages}
          totalRocords={totalElements}
          recordsPerPage={pageSize}
          paginationRecordsPerPageMessage={t('labels.perPage')}
          paginationTotalRecorsMessage={t('labels.results')}
          noDataComponent={
            <ErrorBanner
              image={<EmptyProviderTable />}
              heading={isDataFiltered ? t('errors.messages.noRecordsFound') : t('manageSPAccount.providers.noData')}
              description={!isDataFiltered && t('label.emptyProviderTableDescription')}
            />
          }
        />
      </div>
    </div>
  );
};

export default List;

const ErrorBanner = ({ heading, description, image }) => {
  const { loading, error } = useTable();
  if (loading) {
    return (
      <div className="error-banner-wrapper">
        <div className="dashboard-loader">
          <Loader variant="circular" />
        </div>
      </div>
    );
  }
  let headingContent, descriptionContent, thumbnail;
  if (error && CommonUtils.isNonEmptyObject(error)) {
    headingContent = 'Some error has occurred';
    descriptionContent = error.message;
    thumbnail = <ErrorIcon />;
  } else {
    headingContent = heading;
    descriptionContent = description;
    thumbnail = image;
  }
  return (
    <div className="error-banner-wrapper">
      <div className="table-notification">
        <div className="MCP-module-wrapper">
          <div className="MCP-module-body">
            {thumbnail}
            <p className="heading">{headingContent}</p>
            <p>{descriptionContent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
