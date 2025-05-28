import ModuleHeader from '@src/components/module-header';
import React, { useEffect, useState } from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useOrgAccountsMultiSelectionContext } from '../context/OrgAccountMultiSelectContext';
import OrgAccountsMultiSelect from '../orgAccountMultiSelect';
import { useSPMaterial } from '@src/mfe/core-config/system-admin/manage-sp-material/context/SPMaterialContext';
import CommonFilters from '@src/components/Filters';
import SPMaterialDataTable from '@src/mfe/core-config/system-admin/manage-sp-material/pages/SPMaterialDataTable';
import Alert from '@src/components/cgat-alert/Alert';

const LinkSPMaterial = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const { applyFilters, clearFilters, selectedSPMaterial } = useSPMaterial();
  const { selectedAccount, selectedOrganization } = useOrgAccountsMultiSelectionContext();
  const isAccountSelected = Array.isArray(selectedAccount) && selectedAccount.some((acc) => acc.isChecked === true);

  useEffect(() => {
    if (!selectedAccount && !selectedOrganization) {
      navigate('/system-admin/config/sp-catalog');
    }
  }, [selectedAccount, selectedOrganization, navigate]);

  const goBack = () => {
    navigate('..', {
      state: { isSuccess: true }
    });
  };

  const handleCancel = () => {
    navigate('..', {
      state: { selectedSPMaterial, selectedAccount, selectedOrganization }
    });
  };

  const handleSave = () => {
    if (selectedSPMaterial.length === 0 || !isAccountSelected) {
      setNotification({
        type: 'error',
        description: t('SPCatalog.error.PeaseSelectRequired')
      });
      return;
    }
    navigate('../review-catalog', {
      state: { selectedSPMaterial, selectedAccount, selectedOrganization }
    });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={goBack} size="md">
          {t('SPCatalog.btnBack')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('SPCatalog.LinkSPMaterial')}</Heading>} />
        {notification && <Alert description={notification.description} onClose={() => setNotification(null)} type={notification.type} />}
        <div className="MCP-panel-container">
          <div style={{ marginBottom: '8px' }}>
            <OrgAccountsMultiSelect />
          </div>
          <div className="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={t('SPCatalog.Material.Placeholder')}
            />
          </div>
          <SPMaterialDataTable isLinkCatalog={true} />
          <div className={'buttonGroup'}>
            <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
              {t('manageSPAccount.button.cancel')}
            </Button>

            <Button type="button" size={'md'} onClick={handleSave}>
              {t('SPCatalog.continue')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkSPMaterial;
