import ModuleHeader from '@src/components/module-header';
import React, { useEffect, useState } from 'react';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useLocation, useNavigate } from 'react-router-dom';
import { TableProvider, usePagination } from '@src/mfe/core-config/manage-providers/context/TableContext';

import OrgAccountsMultiSelect from '../orgAccountMultiSelect';
import { useOrgAccountsMultiSelectionContext } from '../context/OrgAccountMultiselectContext';

import ReviewCatalogList from './ReviewCatalogList';
import { LinkedCatalogService, prepareCombinedData } from './dataUtil';
import { useSPMaterial } from '@src/mfe/order-management/pages/system-configuration/manage-spmaterial/context/SPMaterialContext';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useMutation } from 'react-query';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import { handleApiError } from '@src/util/ApiUtils';
import { useMultiSelectionfromState } from '../useMultiSelection.';
import { ROUTE_PATHS } from '../../routes/constants';
import { RoutePaths } from '@src/routes/constants';
const ReviewCatalog = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);
  const { selectedSPMaterial } = useSPMaterial();
  const {
    selectedAccount,
    selectedOrganization,
    setSelectedOrganization,
    setSelectedAccount,
    setOptions,
    setAccountOptions,
    options,
    accountOptions
  } = useOrgAccountsMultiSelectionContext();

  const service = LinkedCatalogService(selectedSPMaterial, selectedAccount);

  const goBack = () => {
    navigate('/admin/sp-catalog');
  };

  const handleCancel = () => {
    navigate('/admin/sp-catalog/link-sp-material', { state: { selectedSPMaterial, selectedAccount } });
  };

  const handleSave = async () => {
    const catalogService = LinkedCatalogService(selectedSPMaterial, selectedAccount);
    const transformedData = catalogService.prepareTransformedData();
    if (transformedData.length === 0) {
      addNotification({
        type: 'error',
        description: t('SPCatalog.error.PeaseSelectRequired')
      });
      return;
    }
    LinkCatalog({ payload: transformedData });
  };

  const { isLoading: isSavingOrUpdating, mutate: LinkCatalog } = useMutation(
    async ({ payload }) => {
      return await SPCatalogService.linkCatalog(payload);
    },
    {
      onSuccess: (result, variables) => {
        const count = variables.payload.length;
        navigate('/admin/sp-catalog', {
          state: {
            items: [
              {
                description: `SP Catalog for ${count} Accounts has been updated successfully.`,
                type: 'success'
              }
            ]
          }
        });
      },
      onError: (error) => {
        const errorKey = handleApiError(error);
        addNotification({
          type: 'error',
          description: t(errorKey)
        });
        return;
      }
    }
  );

  return (
    <div className="MCP-module-wrapper catalog-module">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={goBack} size="md">
          {t('SPCatalog.btnBack')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('SPCatalog.LinkSPMaterial')}</Heading>} />
        {notifications?.length > 0 && (
          <div className="alert-container">
            <div className="MCP-module-body">
              {notifications.map((item, index) => (
                <Alert key={item.id} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />
              ))}
            </div>
          </div>
        )}
        <div className="MCP-CardContainer">
          <div className="disabled-div">
            <OrgAccountsMultiSelect />
          </div>

          <TableProvider
            key={1}
            defaultFilters={[]}
            allowedSort={['materialNumber', 'productName', 'accountNumber']}
            fetchFn={service.getAllData}>
            <ReviewCatalogList service={service} />
          </TableProvider>
          <div className={'buttonGroup'}>
            <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
              {t('manageSPAccount.button.cancel')}
            </Button>

            <Button type="button" size={'md'} onClick={handleSave}>
              {t('SPCatalog.button.updatecatalog')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCatalog;
