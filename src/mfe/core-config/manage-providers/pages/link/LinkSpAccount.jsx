import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { Button, Heading, Alert, Label } from '@mckesson/mcp-component-library';
import { LinkSpAccountProvider } from '../../context/LinkSpAccountContext';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import { useMutation } from 'react-query';
import ProviderService from '@src/api/commonService/ProviderService';
import SpAccountTable from './SpAccountTable';
import style from './LinkSpAccount.module.scss';
function LinkSpAccount() {
  const [spAccount, setSpAccount] = useState([]);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('isEdit') === 'true';

  const providerIds =
    searchParams.get('accounts')?.split(',').map(Number) || [];
  const {
    items: notifications,
    add: addNotification,
    remove: removeNotification
  } = useTimedArray(10000);

  const onSubmitHandler = () => {
    if (!spAccount?.length) {
      addNotification({
        type: 'error',
        description: t('provider.sp.account.selectSP')
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
      onSuccess: () => {
        if (!isEdit) {
          navigate(`/admin/providers`, {
            state: {
              type: 'success',
              messages: `${providerIds.length} ${t(
                'provider.sp.account.linkSP_1'
              )} ${spAccount.length} ${t('provider.sp.account.linkSP_1')}`
            }
          });
        } else {
          navigate(`/admin/providers/${providerIds[0]}/details`, {
            state: {
              type: 'success',
              messages: `${spAccount.length} ${t(
                'provider.sp.account.haslinkedsuccessfully'
              )}`
            }
          });
        }
      },
      onError: () => {
        setSelectedProviders([]);
        addNotification({
          type: 'error',
          description: t('provider.sp.account.unableToLink')
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
          onClick={handleGoBack}
          size="md">
          {t('provider.btnBackToProviders')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={
            <Heading as="h1">{t('provider.sp.account.linkSPAccounts')}</Heading>
          }
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
