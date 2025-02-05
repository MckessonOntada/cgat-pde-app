import React, { useState, useEffect, useMemo } from 'react';
import { Alert, Button, Heading, Label } from '@mckesson/mcp-component-library';

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
import { useQuestionnaire } from '../../context/QuestionnaireContext';
import QuestionnaireConfig from '@src/api/commonService/QuestionnaireService';
import { useMutation } from 'react-query';
import { handleApiError } from '@src/util/ApiUtils';
import './index.scss';
import TableHeading from '@src/components/tableHeading/TableHeading';

export default function mapQuestionnaire() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { applyFilters, clearFilters, setEntity } = useManagerQuestionnaire();

  const { setSelectedTemplates, selectedTemplates, setTemplates } = useQuestionnaire();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const location = useLocation();
  const [alertDescription, setAlertDescription] = useState('');
  const [alert, setAlert] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedEntityType = location.state?.value || false;
  const templatesSelected = location.state?.selectedTemplates;
  const { isMaterial, isCatalog, isAccount } = getEntityTypeFlags(selectedEntityType);

  const handleCancel = () => {
    navigate('../');
  };
  useEffect(() => {
    setEntity(selectedEntityType);
  }, [selectedEntityType]);

  useEffect(() => {
    if (selectedTemplates.length === 0) {
      setSelectedTemplates(templatesSelected);
    }
  }, [selectedEntityType]);

  const handleOnSubmit = () => {
    if (selectedRows.length === 0) {
      const alertDesc = t(
        isMaterial
          ? 'messages.error_config_material'
          : isCatalog
          ? 'messages.error_config_catalog'
          : isAccount
          ? 'messages.error_config_account'
          : ''
      );
      showAlert('error', alertDesc);
      return;
    }
    ConfigureQuestionnaire();
  };

  const templateNames = selectedTemplates.map((template) => template.templateName).join(', ');

  function buildPayload({ isMaterial, isCatalog, isAccount, selectedRows = [] }) {
    return {
      questionnaireIds: selectedTemplates.map((template) => template.id),
      materialNumberList: isMaterial ? selectedRows.map((row) => row.materialNumber) : [],
      accountNumberList: isAccount ? selectedRows.map((row) => row.accountNumber) : [],
      catalogIdAttributes: isCatalog
        ? selectedRows.map((row) => ({
            sapMaterial: row.sapMaterial.toString(),
            soldToCustomer: row.soldToCustomer,
            shipToCustomer: row.shipToCustomer,
            variant: row.variant
          }))
        : []
    };
  }

  const { mutate: ConfigureQuestionnaire } = useMutation(
    async () => {
      const payload = buildPayload({ isMaterial, isCatalog, isAccount, selectedRows });
      return await QuestionnaireConfig.configureQuestionnaire(selectedEntityType, payload);
    },
    {
      onSuccess: (result) => {
        navigate('../', { state: { value: selectedEntityType, isSuccess: true } });
      },
      onError: (error) => {
        const errorKey = handleApiError(error);
        showAlert('error', t(errorKey));
      }
    }
  );

  const showAlert = (type, message) => {
    setAlert({ type });
    setIsAlertVisible(true);
    setAlertDescription(message);
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };
  const handleOnBackToQuestionnaire = () => {
    navigate('../');
  };

  const handleOnClick = () => {
    navigate('../', { state: { value: selectedEntityType, selectedTemplates: selectedTemplates } });
  };
  return (
    <div className="MCP-module-wrapper" id={debugIds(ID.TABLE, ID.CONTAINER)}>
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={handleOnBackToQuestionnaire}
          size="md">
          {t('captions.btnBackToManageQuestionnaire')}
        </Button>
      </div>
      <div className="row-space-between-center">
        <div className="styled-heading">
          <Heading as="h1">
            {t(isMaterial ? 'headings.manageMaterial' : isCatalog ? 'headings.manageCatalog' : 'headings.manageAccount')}
          </Heading>
        </div>
        <div className="alignMultiple">
          <Label className="spnTemplate">{templateNames}</Label>
          <Button onClick={handleOnClick} variant="tertiary" size="md">
            {t('button.caption.change')}
          </Button>
        </div>
      </div>
      {isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type={alert.type} duration={10000} />}
      <div className="MCP-panel-container" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
        {!isMaterial && <OrgAccountsSelect handleAccountChange={() => {}} showAccountsSelect={!!isCatalog} />}
        <div className="MCP-CardContainer">
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

        <TableHeading
          heading={t(
            isMaterial ? 'table.ariaLabel.materialList' : isCatalog ? 'table.ariaLabel.catalogList' : 'table.ariaLabel.accountList'
          )}
          secondaryView={selectedRows && selectedRows.length > 0}
          secondaryViewHeading={`${selectedRows.length} ${t('userManagement.selected_items')}`}
          secondaryViewControls={
            <Button size="md" variant="secondary" type="submit" onClick={handleOnSubmit}>
              {t('label.addquestionnaire')}
            </Button>
          }
        />
        <EntityDataTable EntityType={selectedEntityType} setSelectedRows={setSelectedRows} showAlert={showAlert} />
      </div>
    </div>
  );
}
