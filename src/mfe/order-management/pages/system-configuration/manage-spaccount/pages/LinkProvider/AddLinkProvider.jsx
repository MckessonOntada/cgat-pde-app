import React, { useState } from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import LinkProviderTable from './LinkProviderTable';
import { LinkProviderProvider } from '../../context/LinkProviderContext';

const AddLinkProvider = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const [selectedProvidersCount, setSelectedProvidersCount] = useState([]);

  const handleGoBack = () => { navigate(-1) };
  const handleAddAccounts = () => {
    navigate(`/orders/system-configuration/manage-spaccount/${spAccountId}`, { state: { type: 'success', messages : `${selectedProvidersCount} Provider has been linked successfully.` } });
  };

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
      <LinkProviderProvider>
        <LinkProviderTable
          isAddLinkProvider= {true}
          setSelectedProvidersCount= {setSelectedProvidersCount}
        />
      </LinkProviderProvider>
      <div className={'buttonGroup'}>
        <Button
          variant="primary"
          type="button"
          onClick={handleGoBack}
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