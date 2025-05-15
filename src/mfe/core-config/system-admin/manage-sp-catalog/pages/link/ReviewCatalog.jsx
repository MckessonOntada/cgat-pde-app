import ModuleHeader from '@src/components/module-header';
import React, { useEffect, useState } from 'react';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import { useLocation, useNavigate } from 'react-router-dom';
import { TableProvider } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';

import OrgAccountsMultiSelect from '../orgAccountMultiSelect';

import ReviewCatalogList from './ReviewCatalogList';
import { LinkedCatalogService } from './dataUtil';
import { useSPMaterial } from '@src/mfe/core-config/system-admin/manage-sp-material/context/SPMaterialContext';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useMutation } from 'react-query';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import { handleApiError } from '@src/util/ApiUtils';
import { useOrgAccountsMultiSelectionContext } from '../context/OrgAccountMultiSelectContext';

const ReviewCatalog = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);
  const { selectedSPMaterial } = useSPMaterial();
  const { selectedAccount, selectedOrganization } = useOrgAccountsMultiSelectionContext();

  const serviceRef = React.useRef(null);
  if (!serviceRef.current) {
    serviceRef.current = LinkedCatalogService(selectedSPMaterial, selectedAccount);
  }

  const service = serviceRef.current;
  const fetchFn = React.useCallback(
    (params) => {
      return service.getAllData(params);
    },
    [service]
  );

  useEffect(() => {
    if (!selectedAccount && !selectedOrganization) {
      navigate('/system-admin/sp-catalog');
    }
  }, [selectedAccount, selectedOrganization, navigate]);

  const goBack = () => {
    navigate('/system-admin/sp-catalog');
  };

  const handleCancel = () => {
    navigate('/system-admin/sp-catalog/link-sp-material', { state: { selectedSPMaterial, selectedAccount } });
  };

  const handleSave = async () => {
    const updatedData = service.getCombinedData();
    if (updatedData.length === 0) {
      addNotification({
        type: 'error',
        description: t('SPCatalog.error.RequiredMissing')
      });
      return;
    }
    const transformedData = updatedData?.map((item) => ({
      spProductId: item.materialNumber,
      spAccountNumber: item.accountNumber
    }));

    LinkCatalog({ payload: transformedData });
  };

  const { isLoading: isSavingOrUpdating, mutate: LinkCatalog } = useMutation(
    async ({ payload }) => {
      return await SPCatalogService.linkCatalog(payload);
    },
    {
      onSuccess: (result, variables) => {
        const count = variables.payload.length;
        navigate('/system-admin/sp-catalog', {
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
  const handleNotification = (notification) => {
    addNotification(notification);
  };
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

          <TableProvider key={1} defaultFilters={[]} allowedSort={['materialNumber', 'productName', 'accountNumber']} fetchFn={fetchFn}>
            <ReviewCatalogList service={service} sendNotification={handleNotification} />
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
