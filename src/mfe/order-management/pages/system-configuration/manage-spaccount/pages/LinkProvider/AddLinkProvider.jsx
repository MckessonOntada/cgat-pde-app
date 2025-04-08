import React, { useState } from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import Accounts from '@src/components/Accounts/Accounts';

const AddLinkProvider = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [alertConfig, setAlertConfig] = React.useState(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddAccounts = () => {};

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={handleGoBack}
          size="md">
          {t('Back to sp account details page')}
        </Button>
      </div>

      <ModuleHeader
        heading={<Heading as="h1">{t('Link Providers')}</Heading>}
      />
      <Accounts />

      <div className={'buttonGroup'}>
        <Button
          variant="primary"
          type="button"
          onClick={handleAddAccounts}
          size={'md'}>
          {t('cancel')}
        </Button>
        <Button
          variant="primary"
          type="button"
          onClick={handleAddAccounts}
          size={'md'}>
          {t('save and update')}
        </Button>
      </div>
    </div>
  );
};

export default AddLinkProvider;