import React from 'react';
import DetailsView from '../../components/DetailsView';
import OrganizationData from '../../mockData/OrganizationData';
import AccountsList from '../../../../components/Accounts/AccountsList';
import SelectedAccountData from '../../mockData/SelectedAccountData';
import './ViewOrg.scss';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { RoutePaths } from '../../../../routes/constants';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';

export default function ViewOrganization() {
  // Call api to get Org data => /practices/{practiceId}
  // Call api to get linked accounts => /practice/{practiceId}/accounts

  const navigate = useNavigate();
  const { t } = useTranslate();
  const goBack = () => {
    navigate(RoutePaths.pathOrgManagement);
  };

  const handleClick = () => {};

  return (
    <div className="viewOrg-container">
      <div className="back-navigation py2 capitalize" onClick={goBack}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>{t('orgManagement.back.organization')}</p>
      </div>

      <h2 className="heading">Organization Details</h2>

      <DetailsView data={OrganizationData} />

      <div className="link-acc-box">
        <h2 className="heading">Linked Accounts</h2>
        <Button
          Icon={add_circle_bold}
          variant="secondary"
          className="button-icon"
          onClick={handleClick}
          size={'md'}>
          ADD ACCOUNT
        </Button>
      </div>

      <AccountsList
        data={SelectedAccountData}
        selectableRows={false}
        omitColumns={['distributionChannel']}
      />
    </div>
  );
}
