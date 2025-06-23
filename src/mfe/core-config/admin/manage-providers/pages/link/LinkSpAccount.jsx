import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { Button, Heading, Label, Loader } from '@mckesson/mcp-component-library';
import { LinkSpAccountProvider } from '../../context/LinkSpAccountContext';
import { useMutation } from 'react-query';
import ProviderService from '@src/api/commonService/ProviderService';
import SpAccountTable from './SpAccountTable';
import style from './LinkSpAccount.module.scss';
import Alert from '@src/components/cgat-alert/Alert';

function LinkSpAccount() {
  const [spAccount, setSpAccount] = useState([]);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('isEdit') === 'true';
  const name = searchParams.get('name');
  const providerIds = searchParams.get('accounts')?.split(',').map(Number) || [];
  const [notification, setNotification] = useState(null);

  const onSubmitHandler = () => {
    if (!spAccount?.length) {
      setNotification({
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
              messages: `${providerIds.length} ${t('provider.sp.account.linkSP_1')} ${spAccount.length} ${t('provider.sp.account.spAccount')}`
            }
          });
        } else {
          navigate(`/admin/providers/${providerIds[0]}/details`, {
            state: {
              type: 'success',
              messages: `${spAccount.length} ${t('provider.sp.account.haslinkedsuccessfully')}`
            }
          });
        }
      },
      onError: () => {
        setSelectedProviders([]);
        setNotification({
          type: 'error',
          description: t('errors.default')
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
  if (isLoading) {
    return <Loader type={'screen'} />;
  }
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('provider.btnBackToProviders')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('provider.sp.account.linkSPAccounts')}</Heading>}
          controls={
            !isEdit && (
              <div className={style.alignMultiple}>
                <Label className={style.spnTemplate}>
                  {/* {providerIds.length} {t('provider.sp.account.selected')} */}
                  {providerIds.length > 1 ? (
                    <span>
                      {providerIds.length} {t('provider.sp.account.selected')}
                    </span>
                  ) : (
                    <span>
                      {name} {t('provider.sp.account.selected')}
                    </span>
                  )}
                </Label>
                <Button onClick={goBack} variant="tertiary" size="md">
                  {t('button.caption.change')}
                </Button>
              </div>
            )
          }
        />
        {notification && <Alert description={notification.description} onClose={() => setNotification(null)} type={notification.type} />}
        <LinkSpAccountProvider>
          <SpAccountTable setSpAccount={setSpAccount} isAddSpAccount={true} />
        </LinkSpAccountProvider>
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
}

export default LinkSpAccount;
