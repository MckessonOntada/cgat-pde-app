import React from 'react';
import CommonFilters from '@src/components/Filters';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { getColumns } from './TableColumns';
import { ReactComponent as EmptyProviderTable } from '@src/assets/svg/EmptyProviderTable.svg';
import CommonDataService from '@src/api/commonService/CommonDataService';
import OrgAccountsSelect from '@src/mfe/order-management/components/orgAccountSelection/OrgAccountsSelect';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle-bold.svg';
import { ReactComponent as FileUploadIcon } from '@src/assets/svg/upload.svg';
import PermittedComponent from '@src/components/permitted-component';
import { ReactComponent as ErrorIcon } from '@src/assets/svg/ErrorCircleFilled.svg';
import { PROVIDER_STATUS } from '@src/mfe/core-config/manage-providers/config';
import {
  useFilters,
  usePagination,
  useTable
} from '@src/mfe/core-config/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';

const CatalogList = () => {
  const { filters, applyFilters, clearFilters } = useFilters();
  const { pagination, changePage } = usePagination();
  const { t } = useTranslate();
  const { data = [] } = useTable();
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
            heading={t('label.noSPAccountSelectedTitle')}
            description={t('label.noSPAccountSelectedDescription')}
          />
        }
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
