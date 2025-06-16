import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading, Button, Loader } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import SPAccountDataTable from '../../manage-sp-account/pages/SPAccounts/SPAccountDataTable';
import { useSPAccountContext } from '../../manage-sp-account/context/SPAccountContext';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import AccountService from '@src/api/commonService/AccountService';
import Alert from '@src/components/cgat-alert/Alert';

function AssociatedSPAccount() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { applyFilters, clearFilters } = useSPAccountContext();
  const [notification, setNotification] = useState(null);

  const location = useLocation();
  const spMaterialId = location.state?.sapID?.materialNumber;

  const { isLoading, mutate: unlinkSpAccounts } = useMutation(
    async (spAccountId) => {
      return await AccountService.removeLinkedSpAccount(spAccountId, spMaterialId);
    },
    {
      onSuccess: () => {
        setNotification({
          type: 'success',
          description: t('manageSPAccount.message.removeSpAccount.success')
        });
      },
      onError: () => {
        setNotification({
          type: 'error',
          description: t('manageSPAccount.error.message.unableToUnlinkAccount')
        });
      }
    }
  );

  const handleUnlinkSpAccounts = (spAccountId) => {
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('manageSPAccount.message.remove.spAccount')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('manageSPAccount.button.cancel')
        },
        confirm: {
          label: t('manageSPAccount.button.confirm'),
          action: () => {
            unlinkSpAccounts(spAccountId);
          }
        }
      }
    });
  };

  if (isLoading) return <Loader type="screen" />;

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate(-1)} size="md">
          {t('Back to sp material master')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <Heading as="h1">{t('Linked SP Account')}</Heading>
        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={t('manageSPAccount.filters.searchPlaceholder')}
            />
          </div>
          {notification && <Alert description={notification.description} onClose={() => setNotification(null)} type={notification.type} />}
          <SPAccountDataTable isSpMaterial={true} handleUnlinkSpAccounts={handleUnlinkSpAccounts} />
        </div>
      </div>
    </div>
  );
}
export default AssociatedSPAccount;
