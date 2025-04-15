import React, { useState } from 'react';
import { Heading, Button, Alert, Loader  } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import LinkProviderTable from './LinkProviderTable';
import { LinkProviderProvider } from '../../context/LinkProviderContext';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import LinkProviderService from '@src/api/commonService/LinkProviderService';
import { useMutation } from 'react-query';
import { useOrgAccountSelectionContext } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';

const AddLinkProvider = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const [selectedProviders, setSelectedProviders] = useState([]);
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);
  const handleGoBack = () => { navigate(-1) };
  const { selectedOrganization } = useOrgAccountSelectionContext();

  const onSubmitHandler = () => {
    handleAddAccounts(
      { selectedProviders },
      {
        onSuccess: () => {
          navigate(`/orders/system-configuration/manage-spaccount/${spAccountId}`, { state: { type: 'success', messages : `${selectedProviders.length} Provider has been linked successfully.` } });
        },
        onError: () => {
          addNotification({
            type: 'error',
            description: t('Unable to link provider')
          });
        }
      }
    );
  };

  const { isLoading, mutate: handleAddAccounts } = useMutation(async (data) => {
    const { selectedProviders } = data;
    return await LinkProviderService.linkProvidersToAccount( selectedOrganization ,spAccountId, selectedProviders);
  });

  if (isLoading) return <Loader type="screen" />;

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
      {notifications?.length > 0 && (
        <div className="alert-container">
          <div className="MCP-module-body">
            {notifications.map((item, index) => (
              <Alert key={item.id} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />
            ))}
          </div>
        </div>
      )}
      <LinkProviderProvider>
        <LinkProviderTable
          isAddLinkProvider= {true}
          setSelectedProviders= {setSelectedProviders}
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
          onClick={onSubmitHandler}
          size={'md'}>
          {t('save and update')}
        </Button>
      </div>
    </div>
  );
};

export default AddLinkProvider;