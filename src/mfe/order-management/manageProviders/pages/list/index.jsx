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
import columns from './TableColumns';
import { CustomDataTable } from '@src/components/dataTableComponent';

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
  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.admin'),
        url: isSystemAdminView ? '/' : '/admin'
      },
      {
        label: t('breadcrumb.providers')
      }
    ];
  }, [isSystemAdminView]);
  const additionalFiltersConfig = React.useMemo(() => {
    return [
      {
        type: 'dropdown',
        name: 'status',
        label: t('filter.status'),
        options: Object.entries(PROVIDER_STATUS).map(([key, value]) => ({
          label: t(`providerStatus.${key}`),
          value: value
        }))
      }
    ];
  }, []);
  const handleOnClick = (url) => () => navigate(url);
  const handleOnApplyFilters = (filters) => {};
  const handleOnClearFilters = () => {};

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <ModuleHeader
        heading={<Heading as="h1">{t('headings.providers')}</Heading>}
        controls={
          <div className="controls">
            <Button Icon={FileUploadIcon} className="button-icon" onClick={handleOnClick('upload-providers')} size="md">
              {t('controls.uploadProviders')}
            </Button>
            <Button Icon={AddCircleFilled} className="button-icon" onClick={handleOnClick('create')} size="md">
              {t('controls.addProvider')}
            </Button>
          </div>
        }
      />
      {items && items.length > 0 && (
        <div className="MCP-module-body">
          {items.map((item, index) => {
            return <Alert key={item.id} description={item.description} onClose={() => remove(item.id)} type={item.type} />;
          })}
        </div>
      )}

      <div className="MCP-CardContainer">
        <div className="MCP-CardContainer">
          <CommonFilters
            onApplyFilters={handleOnApplyFilters}
            onClearFilters={handleOnClearFilters}
            additionalFilters={additionalFiltersConfig}
            searchPlaceholder={t('controls.placeholder.searchOrderPlaceholder')}
          />
        </div>
        <CustomDataTable
          id="provider-list-table"
          columns={columns}
          data={data}
          handleChangePage={() => {}}
          onSortIconClick={() => {}}
          pagination={true}
          currentPage={1}
          totalPageCount={1}
          totalRocords={1}
          recordsPerPage={1}
          paginationRecordsPerPageMessage={t('labels.perPage')}
          paginationTotalRecorsMessage={t('labels.results')}
          noDataComponent={<div>{t('labels.noData')}</div>}
        />
      </div>
    </div>
  );
};

export default List;
