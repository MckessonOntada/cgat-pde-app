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
import {
  useFilters,
  usePagination,
  useSort,
  useTable
} from '../../../manage-providers/context/TableContext';
import { getColumns } from './TableColumns';
import { ReactComponent as EmptyProviderTable } from '@src/assets/svg/EmptyProviderTable.svg';
import { ReactComponent as ErrorIcon } from '@src/assets/svg/ErrorCircleFilled.svg';
import { PROVIDER_STATUS } from '@src/mfe/core-config/manage-providers/config';

const List = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { items, add, remove } = useTimedArray(10000);
  const { filters, applyFilters, clearFilters } = useFilters();
  const { pagination, changePage } = usePagination();
  const { data = [] } = useTable();
  const { applySort } = useSort();
  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.systemAdmin'),
        url: '/admin'
      },
      {
        label: t('breadcrumb.systemConfiguration'),
        url: '/orders/system-configuration'
      },
      {
        label: t('label.materialCrosswalk')
      }
    ];
  }, [isSystemAdminView]);
  const handleOnClick = (url) => () => navigate(url);

  const handleOnSort = (data, direction) => {
    const { sortKey } = data;
    if (sortKey && direction) {
      applySort(sortKey, direction);
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <ModuleHeader
        heading={<Heading as="h1">{t('label.materialCrosswalk')}</Heading>}
        controls={
          <div className="controls">
            <Button
              Icon={AddCircleFilled}
              className="button-icon"
              onClick={handleOnClick('create')}
              disabled={true}
              size="md">
              {t('controls.addCrosswalk')}
            </Button>
            <Button
              Icon={FileUploadIcon}
              className="button-icon"
              onClick={handleOnClick('upload')}
              size="md">
              {t('controls.uploadCrosswalk')}
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
            additionalFilters={[]}
            searchPlaceholder={t('controls.placeholder.materialCrosswalk')}
          />
        </div>
        <ModuleHeader
          heading={
            <Heading as="h2">{t('label.materialCrosswalkListing')}</Heading>
          }
        />
        <CustomDataTable
          id="provider-list-table"
          columns={getColumns()}
          data={data}
          handleChangePage={changePage}
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
