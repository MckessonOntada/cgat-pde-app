import ModuleHeader from '@src/components/module-header';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { ReactComponent as FileUploadIcon } from '@src/assets/svg/upload.svg';
import PermittedComponent from '@src/components/permitted-component';
import React from 'react';
import {
  Button,
  Heading,
  Alert,
  Loader
} from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useNavigate } from 'react-router-dom';
import CommonFilters from '@src/components/Filters';
import { PROVIDER_STATUS } from '../../config';
import { CustomDataTable } from '@src/components/dataTableComponent';
import {
  useFilters,
  usePagination,
  useTable
} from '../../context/TableContext';
import { getColumns } from './TableColumns';
import { ReactComponent as EmptyProviderTable } from '@src/assets/svg/EmptyProviderTable.svg';
import { ReactComponent as ErrorIcon } from '@src/assets/svg/ErrorCircleFilled.svg';
import CommonUtils from '@src/util/CommonUtils';

const List = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { items, add, remove } = useTimedArray(10000);
  const { filters, applyFilters, clearFilters } = useFilters();
  const { data = [], loading, error } = useTable();
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
  const handleOnClick = (url) => () => navigate(url);
  console.log(pagination);
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
          columns={getColumns(add)}
          data={data}
          handleChangePage={(_event, pageIndex) => changePage(pageIndex)}
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
