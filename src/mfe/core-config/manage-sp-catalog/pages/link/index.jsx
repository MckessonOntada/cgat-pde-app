import ModuleHeader from '@src/components/module-header';
import React, { useEffect, useMemo, useRef } from 'react';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useOrgAccountsMultiSelectionContext } from '../context/OrgAccountMultiSelectContext';
import OrgAccountsMultiSelect from '../orgAccountMultiSelect';
import { useSPMaterial } from '@src/mfe/order-management/pages/system-configuration/manage-spmaterial/context/SPMaterialContext';
import CommonFilters from '@src/components/Filters';
import SPMaterialDataTable from '@src/mfe/order-management/pages/system-configuration/manage-spmaterial/pages/SPMaterialDataTable';

const LinkSPMaterial = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    items: notifications,
    add: addNotification,
    remove: removeNotification
  } = useTimedArray(10000);
  const { applyFilters, clearFilters, selectedSPMaterial } = useSPMaterial();
  const { selectedAccount, selectedOrganization } =
    useOrgAccountsMultiSelectionContext();

  useEffect(() => {
    if (!selectedAccount && !selectedOrganization) {
      navigate('/admin/sp-catalog');
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
    if (selectedSPMaterial.length === 0) {
      addNotification({
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
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={goBack}
          size="md">
          {t('SPCatalog.btnBack')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('SPCatalog.LinkSPMaterial')}</Heading>}
        />
        {notifications?.length > 0 && (
          <div className="alert-container">
            <div className="MCP-module-body">
              {notifications.map((item, index) => (
                <Alert
                  key={item.id}
                  description={item.description}
                  onClose={() => removeNotification(item.id)}
                  type={item.type}
                />
              ))}
            </div>
          </div>
        )}
        <div className="MCP-panel-container">
          <div style={{ marginBottom: '8px' }}>
            <OrgAccountsMultiSelect />
          </div>
          <div class="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={t('SPCatalog.Material.Placeholder')}
            />
          </div>
          <SPMaterialDataTable isLinkCatalog={true} />
          <div className={'buttonGroup'}>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              size={'md'}>
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
