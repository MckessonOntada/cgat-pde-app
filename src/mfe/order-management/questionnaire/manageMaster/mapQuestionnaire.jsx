import React, { useState, useEffect, useMemo } from 'react';
import { Alert, Button, Heading } from '@mckesson/mcp-component-library';

import { useTranslate } from '@src/translations/useTranslation';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import { debugIds, ID } from '@src/constants/id';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { ReactComponent as upload_bottom } from '@src/assets/image/upload_bottom.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import CommonFilters from '@src/components/Filters';
import usePermission from '@src/hooks/usePermissions';
import EntityDataTable from './EntityDataTable';
import { useManagerQuestionnaire } from '../../context/ManageQuestionnaireContext';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { getEntityTypeFlags, MasterEntityType } from '../util';
import OrgAccountsSelect from '../../components/orgAccountSelection/OrgAccountsSelect';

export default function mapQuestionnaire() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { applyFilters, clearFilters, setEntity } = useManagerQuestionnaire();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const location = useLocation();
  const [alertDescription, setAlertDescription] = useState('');
  const [alert, setAlert] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedEntityType = location.state?.value || false; 
  const { isMaterial, isCatalog, isAccount } = getEntityTypeFlags(selectedEntityType); 

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    setEntity(selectedEntityType);
  }, [selectedEntityType]);

  const handleOnSubmit = () => {
    if (selectedRows.length === 0) {
      setAlertDescription(
        t(isMaterial ? 'messages.error_config_material' : isCatalog ? 'messages.error_config_catalog' : 'messages.error_config_account')
      );
      setIsAlertVisible(true);
      setAlert({ type: 'error' });
      return;
    }
    navigate('../', { state: { isMaterial: isMaterial, isCatalog: isCatalog, isAccount: isAccount } });
  };
  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };
  const handleOnBackToOrders = () => {
    navigate(-1);
  };

  return (
    <div className="MCP-module-wrapper" id={debugIds(ID.TABLE, ID.CONTAINER)}>
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToOrders} size="md">
          {t('captions.btnBackToManageQuestionnaire')}
        </Button>
      </div>

      <ModuleHeader
        heading={
          <Heading as="h1">
            {t(isMaterial ? 'headings.manageMaterial' : isCatalog ? 'headings.manageCatalog' : 'headings.manageAccount')}
          </Heading>
        }
      />
      {isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type={alert.type} duration={10000} />}
      <div className="MCP-panel-container" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
      {!isMaterial && <OrgAccountsSelect handleAccountChange={() => {}} showAccountsSelect={!!isCatalog} />}
        <div className="MCP-panel-container"> 
          <CommonFilters
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            additionalFilters={[]}
            searchPlaceholder={t(
              isMaterial
                ? 'controls.placeholder.material.search'
                : isCatalog
                ? 'controls.placeholder.Catalogs.search'
                : 'controls.placeholder.Accounts.search'
            )}
          />
        </div> 
        <Heading as="h2">{t( isMaterial
                ? 'table.ariaLabel.materialList'
                : isCatalog
                ? 'table.ariaLabel.catalogList'
                : 'table.ariaLabel.accountList')}</Heading>
        <EntityDataTable EntityType={selectedEntityType} setSelectedRows={setSelectedRows} />
      </div>
      <ModuleHeader
        controls={
          <div className="controls">
            <Button size="md" variant="secondary" onClick={handleCancel}>
              {t('captions.btnCancel')}
            </Button>
            <Button size="md" variant="primary" type="submit" onClick={handleOnSubmit}>
              {t('label.addquestionnaire')}
            </Button>
          </div>
        }
      />
    </div>
  );
}
