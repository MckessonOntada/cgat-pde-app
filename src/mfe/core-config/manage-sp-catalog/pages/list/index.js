import ModuleHeader from '@src/components/module-header';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { ReactComponent as FileUploadIcon } from '@src/assets/svg/upload.svg';
import PermittedComponent from '@src/components/permitted-component';
import React from 'react';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useNavigate } from 'react-router-dom';
import CommonFilters from '@src/components/Filters';
import { CustomDataTable } from '@src/components/dataTableComponent';

import { getColumns } from './TableColumns';
import { ReactComponent as EmptyProviderTable } from '@src/assets/svg/EmptyProviderTable.svg';
import { ReactComponent as ErrorIcon } from '@src/assets/svg/ErrorCircleFilled.svg';
import { PROVIDER_STATUS } from '@src/mfe/core-config/manage-providers/config';
import {
  useFilters,
  usePagination,
  useTable
} from '@src/mfe/core-config/manage-providers/context/TableContext';
import OrgAccountsSelect from '@src/mfe/order-management/components/orgAccountSelection/OrgAccountsSelect';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';

const data = [
  {
    id: 1,
    providerName: 'Provider A',
    address: '123 Main St',
    deaNumber: 'AB1234567',
    npiNumber: '1234567890',
    status: 'ACTIVE'
  },
  {
    id: 2,
    providerName: 'Provider B',
    address: '456 Elm St',
    deaNumber: 'CD9876543',
    npiNumber: '0987654321',
    status: 'INACTIVE'
  }
];

const List = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { items, add, remove } = useTimedArray(10000);
  const { filters, applyFilters, clearFilters } = useFilters();
  const { pagination, changePage } = usePagination();
  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.systemAdmin'),
        url: '/admin'
      },
      {
        label: t('breadcrumb.systemConfiguration'),
        url: '/admin/system-configuration'
      },
      {
        label: t('label.manageSpCatalog')
      }
    ];
  }, [isSystemAdminView]);
  const additionalFiltersConfig = React.useMemo(() => {
    return [
      {
        type: 'dropdown',
        name: 'statuses',
        label: t('captions.status'),
        options: Object.entries(PROVIDER_STATUS).map(([key, value]) => ({
          label: t(`providerStatus.${key}`),
          value: value
        }))
      }
    ];
  }, []);
  const handleOnClick = (url) => () => navigate(url);

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <ModuleHeader
        heading={<Heading as="h1">{t('label.manageSpCatalog')}</Heading>}
      />
      {items && items.length > 0 && (
        <div className="MCP-module-body">
          {items.map((item, index) => {
            return (
              <Alert
                key={item.id}
                description={item.description}
                onClose={() => remove(item.id)}
                type={item.type}
              />
            );
          })}
        </div>
      )}

      <div className="MCP-CardContainer">
        <div className="MCP-CardContainer">
          <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-2">
            <div className="org-select">
              <MultiSelectDropdown
                id={'select-org-search'}
                label={t('ManageCatalog.SelectOrganization')}
                isMultiSelect={false}
                placeholder={t('ManageCatalog.SelectOrganization')}
                onChange={() => {}}
                options={[]}
                variant={'async'}
                onSearch={(event) => {}}
                recordsCountToEnableSearch={5}
                size="md"
                isSortEnable={false}
                value={''}
                // fieldDisplayValue={
                //   selectedOrganization?.name
                //     ? {
                //         label: selectedOrganization.name,
                //         value: selectedOrganization.id.toString()
                //       }
                //     : undefined
                // }
              />
            </div>
            <div className="account-select">
              <MultiSelectDropdown
                id={'select-account-search'}
                label={t('ManageCatalog.SelectAccount')}
                isMultiSelect={true}
                placeholder={t('ManageCatalog.SelectAccount')}
                onChange={() => {}}
                options={[]}
                variant={'async'}
                onSearch={(event) => {}}
                recordsCountToEnableSearch={5}
                size="md"
              />
            </div>
          </div>
        </div>
        <div className="MCP-CardContainer">
          <CommonFilters
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            additionalFilters={additionalFiltersConfig}
            searchPlaceholder={t(
              'controls.placeholder.searchProviderPlaceholder'
            )}
          />
        </div>
        <ModuleHeader
          heading={<Heading as="h2">{t('label.sPCatalogListing')}</Heading>}
          controls={
            <div className="controls">
              <Button
                variant="secondary"
                className="button-icon"
                onClick={handleOnClick('upload')}
                size="md">
                {t('controls.downloadList')}
              </Button>
              <Button
                Icon={FileUploadIcon}
                className="button-icon"
                onClick={handleOnClick('upload')}
                size="md">
                {t('controls.uploadCatalog')}
              </Button>
              <Button
                Icon={AddCircleFilled}
                className="button-icon"
                onClick={handleOnClick('create')}
                size="md">
                {t('controls.linkCatalog')}
              </Button>
            </div>
          }
        />
        <CustomDataTable
          id="provider-list-table"
          columns={getColumns()}
          data={data}
          handleChangePage={changePage}
          onSortIconClick={() => {}}
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
              heading={t('label.addSPProducts')}
              description={t('label.emptySPCatalogTableDescription')}
            />
          }
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
