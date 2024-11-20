import React, { useState } from 'react';
import DetailsView from '../../components/DetailsView';
import OrganizationData from '../../mockData/OrganizationData';
import AccountsList from '@src/components/Accounts/AccountsList';
import SelectedAccountData from '../../mockData/SelectedAccountData';
import './ViewOrg.scss';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { RoutePaths } from '@src/routes/constants';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { PATHS as InternalPaths } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';

export default function ViewOrganization() {
  // Call api to get Org data => /practices/{practiceId}
  // Call api to get linked accounts => /practice/{practiceId}/accounts

  const navigate = useNavigate();
  const { t } = useTranslate();

  const [addNewAccounts, setAddNewAccounts] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const goBack = () => {
    navigate(RoutePaths.pathOrgManagement);
  };

  const addNewAccountsClick = () => {
    console.log('selectedAccounts', selectedAccounts);
    handleCancel();
  };

  const handleCancel = () => {
    setSelectedAccounts([]);
    setAddNewAccounts(false);
  };
  return (
    <div className="viewOrg-container">
      <div className="back-navigation py2 capitalize" onClick={goBack}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>{t('orgManagement.back.organization')}</p>
      </div>

      <ModuleHeader
        heading={<p className="primaryHeading">{t('orgManagement.create_org.org-details')}</p>}
      />

      <div className="details-view-container">
        <DetailsView
          data={OrganizationData}
          onEditClick={() =>
            navigate(`../${InternalPaths.editOrg}/${OrganizationData.id}`, {}, true)
          }
        />
      </div>

      <ModuleHeader
        heading={
          <p className="primaryHeading">
            {addNewAccounts ? t('orgManagement.select_account') : t('orgManagement.link')}
          </p>
        }
        controls={
          !addNewAccounts && (
            <div className="controls">
              <Button
                Icon={add_circle_bold}
                variant="secondary"
                className="button-icon"
                onClick={() => setAddNewAccounts(true)}
                size={'md'}>
                {t('orgManagement.add.account')}
              </Button>
            </div>
          )
        }
      />

      <AccountsList
        data={SelectedAccountData}
        showSelectedAccounts={addNewAccounts}
        omitColumns={addNewAccounts ? ['action'] : ['distributionChannel']}
        selectableRows={addNewAccounts}
        selectedRows={selectedAccounts}
        setSelectedRows={(newAccounts) => setSelectedAccounts(newAccounts)}
      />

      {addNewAccounts && (
        <div className="btn-box">
          <Button variant="secondary" onClick={handleCancel}>
            {t('orgManagement.button.cancel')}
          </Button>
          <Button onClick={addNewAccountsClick}>{t('orgManagement.add.account')}</Button>
        </div>
      )}
    </div>
  );
}
