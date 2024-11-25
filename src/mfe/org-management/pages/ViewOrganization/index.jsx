import React, { useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import DetailsView from '../../components/DetailsView';
import AccountsList from '@src/components/Accounts/AccountsList';
import SelectedAccountData from '../../mockData/SelectedAccountData';
import './ViewOrg.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { RoutePaths } from '@src/routes/constants';
import { Button, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { PATHS as InternalPaths } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';

export default function ViewOrganization() {
  // Call api to get linked accounts => /practice/{practiceId}/accounts

  const { orgId } = useParams();

  const navigate = useNavigate();
  const { t } = useTranslate();

  const [addNewAccounts, setAddNewAccounts] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  // Fetch practice details
  const { isLoading, data, isError } = useQuery({
    queryKey: [`practices/${orgId}`],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(
        `${ApiRoutes.ORGANIZATIONS}/${orgId}`, // Use practice id from organization
        httpVerb.GET,
        {}
      );

      return res.data;
    },
    refetchOnWindowFocus: false
  });
  
  const goBack = () => {
    navigate(RoutePaths.pathOrgManagement);
  };

  const addNewAccountsClick = () => {
    handleCancel();
  };

  const handleCancel = () => {
    setSelectedAccounts([]);
    setAddNewAccounts(false);
  };
  return (
    <div className="viewOrg-container">
      { isLoading &&  <Loader type={'screen'} />}
      <div className="back-navigation py2 capitalize" onClick={goBack}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>{t('orgManagement.back.organization')}</p>
      </div>

      <ModuleHeader
        heading={<p className="primaryHeading">{t('orgManagement.create_org.org-details')}</p>}
      />

      {
        data &&       <div className="details-view-container">
        <DetailsView
          data={data}
          onEditClick={() =>
            navigate(`../${InternalPaths.editOrg}/${orgId}`, {}, true)
          }
        />
      </div>
      }

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
