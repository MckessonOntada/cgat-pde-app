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
import { PROVIDER_STATUS } from '../../config';
import { CustomDataTable } from '@src/components/dataTableComponent';
import {
  useColumns,
  useFilters,
  usePagination,
  useTable
} from '../../context/TableContext';
import { getColumns } from './TableColumns';
import EmptyDataTable from '@src/components/EmptyTable';
import { ReactComponent as EmptyProviderTable } from '@src/assets/svg/EmptyProviderTable.svg';
import { ReactComponent as ErrorIcon } from '@src/assets/svg/ErrorCircleFilled.svg';

const data = [
  {
    id: 1,
    providerName: 'Provider A',
    address: '123 Main St',
    deaNumber: 'AB1234567',
    npiNumber: '1234567890',
    isActive: true
  },
  {
    id: 2,
    providerName: 'Provider B',
    address: '456 Elm St',
    deaNumber: 'CD9876543',
    npiNumber: '0987654321',
    isActive: false
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
        heading={<Heading as="h1">{t('label.providers')}</Heading>}
        controls={
          <div className="controls">
            <Button
              Icon={FileUploadIcon}
              className="button-icon"
              onClick={handleOnClick('upload-providers')}
              size="md">
              {t('controls.uploadProviders')}
            </Button>
            <Button
              Icon={AddCircleFilled}
              className="button-icon"
              onClick={handleOnClick('create')}
              size="md">
              {t('controls.addProviders')}
            </Button>
          </div>
        }
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
          heading={<Heading as="h2">{t('label.providerListing')}</Heading>}
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
              heading={t('controls.addProviders')}
              description={t('label.emptyProviderTableDescription')}
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
