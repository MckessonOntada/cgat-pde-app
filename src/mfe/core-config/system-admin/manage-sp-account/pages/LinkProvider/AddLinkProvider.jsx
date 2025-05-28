import React, { useState } from 'react';
import { Heading, Button, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import LinkProviderTable from './LinkProviderTable';
import { LinkProviderProvider } from '../../context/LinkProviderContext';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import LinkProviderService from '@src/api/commonService/LinkProviderService';
import { useMutation } from 'react-query';
import Alert from '@src/components/cgat-alert/Alert';

const AddLinkProvider = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const [selectedProviders, setSelectedProviders] = useState([]);
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);
  const handleGoBack = () => {
    navigate(-1);
  };
  const [searchParams] = useSearchParams();
  const selectedOrganization = searchParams.get('orgId');

  const onSubmitHandler = () => {
    if (!selectedProviders || selectedProviders.length === 0) {
      addNotification({
        type: 'error',
        description: t('manageSPAccount.error.message.selectProvider')
      });
      return;
    }

    const selectedProviderIds = selectedProviders.map((p) => Number(p.id));
    handleAddAccounts(selectedProviderIds);
  };

  const { isLoading, mutate: handleAddAccounts } = useMutation(
    async (selectedProviderIds) => {
      return LinkProviderService.linkProvidersToAccount(selectedOrganization, spAccountId, selectedProviderIds);
    },
    {
      onSuccess: (_, selectedProviderIds) => {
        navigate(`/system-admin/config/manage-sp-account/${spAccountId}?orgId=${selectedOrganization}`, {
          state: {
            type: 'success',
            messages: `${selectedProviderIds.length} ${t('manageSPAccount.success.message.addProvider')}`
          }
        });
      },
      onError: () => {
        setSelectedProviders([]);
        addNotification({
          type: 'error',
          description: t('manageSPAccount.error.message.unableToAddProvider')
        });
      }
    }
  );

  if (isLoading) return <Loader type="screen" />;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('manageSPAccount.btn.backToSpAccount')}
        </Button>
      </div>
      <ModuleHeader heading={<Heading as="h1">{t('manageSPAccount..heading.linkProviders')}</Heading>} />
      <div className="MCP-module-body">
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
          <LinkProviderTable setSelectedProviders={setSelectedProviders} />
        </LinkProviderProvider>
        <div className={'buttonGroup'}>
          <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
            {t('manageSPAccount.button.cancel')}
          </Button>
          <Button variant="primary" type="button" onClick={onSubmitHandler} size={'md'}>
            {t('manageSPAccount.button.saveandupdate')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddLinkProvider;
