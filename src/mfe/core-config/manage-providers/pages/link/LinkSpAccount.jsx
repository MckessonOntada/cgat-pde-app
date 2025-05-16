import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import {
  Button,
  Heading,
  Alert,
  Loader,
  Label
} from '@mckesson/mcp-component-library';
import { LinkSpAccountProvider } from '../../context/LinkSpAccountContext';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import { useMutation } from 'react-query';
import ProviderService from '@src/api/commonService/ProviderService';
import SpAccountTable from './SpAccountTable';
import style from './LinkSpAccount.module.scss';
function LinkSpAccount() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const providerIds =
    searchParams.get('accounts')?.split(',').map(Number) || [];
  const [spAccount, setSpAccount] = useState([]);
  const {
    items: notifications,
    add: addNotification,
    remove: removeNotification
  } = useTimedArray(10000);

  const onSubmitHandler = () => {
    if (!spAccount?.length) {
      addNotification({
        type: 'error',
        description: t('Please select SP Accounts')
      });
      return;
    }

    const accountIds = spAccount.map((p) => Number(p.accountNumber));
    handleAddAccounts({ providerIds, accountIds });
  };

  const { isLoading, mutate: handleAddAccounts } = useMutation(
    async ({ providerIds, accountIds }) => {
      return ProviderService.linkProvidersToAccount(providerIds, accountIds);
    },
    {
      onSuccess: (_, variables) => {
        navigate(`/admin/providers`, {
          state: {
            type: 'success',
            messages: `${providerIds.length} ${t(
              'Provider(s) has been successfully linked with '
            )} ${spAccount.length} ${t('SP Account.')}`
          }
        });
      },
      onError: () => {
        setSelectedProviders([]);
        addNotification({
          type: 'error',
          description: t('Unable to link SP Account(s)')
        });
      }
    }
  );

  const goBack = () => {
    navigate('/admin/providers', {
      state: { isSuccess: true }
    });
  };
  const handleGoBack = () => {
    navigate(-1);
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
          {t('Back to Manage provider')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('Link SP Accounts')}</Heading>}
          controls={
            <div className={style.alignMultiple}>
              <Label className={style.spnTemplate}>
                {providerIds.join(', ') || ''}
              </Label>
              <Button onClick={goBack} variant="tertiary" size="md">
                {t('button.caption.change')}
              </Button>
            </div>
          }
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
        <LinkSpAccountProvider>
          <SpAccountTable setSpAccount={setSpAccount} isAddSpAccount={true} />
        </LinkSpAccountProvider>
        <div className={'buttonGroup'}>
          <Button
            variant="secondary"
            type="button"
            onClick={handleGoBack}
            size={'md'}>
            {t('manageSPAccount.button.cancel')}
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={onSubmitHandler}
            size={'md'}>
            {t('manageSPAccount.button.saveandupdate')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LinkSpAccount;
