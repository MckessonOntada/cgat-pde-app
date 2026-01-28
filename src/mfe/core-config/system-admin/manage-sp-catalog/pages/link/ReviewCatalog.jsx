import ModuleHeader from '@src/components/module-header';
import React, { useEffect, useState } from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate } from 'react-router-dom';
import { TableProvider } from '@src/context/TableContext';

import OrgAccountsMultiSelect from '../orgAccountMultiSelect';

import ReviewCatalogList from './ReviewCatalogList';
import { LinkedCatalogService } from './dataUtil';
import { useSPMaterial } from '@src/mfe/core-config/system-admin/manage-sp-material/context/SPMaterialContext';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useMutation } from 'react-query';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import { handleApiError } from '@src/util/ApiUtils';
import { useOrgAccountsMultiSelectionContext } from '../context/OrgAccountMultiSelectContext';
import Alert from '@src/components/cgat-alert/Alert';

const ReviewCatalog = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const { selectedSPMaterial } = useSPMaterial();
  const { selectedAccount, selectedOrganization } = useOrgAccountsMultiSelectionContext();
  const checkedCount = Array.isArray(selectedAccount) ? selectedAccount.filter((acc) => acc.isChecked === true).length : 0;
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
      navigate('/system-admin/config/sp-catalog');
    }
  }, [selectedAccount, selectedOrganization, navigate]);

  const goBack = () => {
    navigate('/system-admin/config/sp-catalog');
  };

  const handleCancel = () => {
    navigate('/system-admin/config/sp-catalog/link-sp-material', { state: { selectedSPMaterial, selectedAccount } });
  };

  const handleSave = async () => {
    const updatedData = service.getCombinedData();
    if (updatedData.length === 0) {
      setNotification({
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
        navigate('/system-admin/config/sp-catalog', {
          state: {
            items: [
              {
                description: `SP Catalog for ${checkedCount} Accounts has been updated successfully.`,
                type: 'success'
              }
            ]
          }
        });
      },
      onError: (error) => {
        const errorKey = handleApiError(error);
        setNotification({
          type: 'error',
          description: t(errorKey)
        });
        return;
      }
    }
  );
  const handleNotification = (notification) => {
    setNotification(notification);
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
        {notification && <Alert description={notification.description} onClose={() => setNotification(null)} type={notification.type} />}

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
